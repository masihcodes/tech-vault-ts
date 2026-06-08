"use server";
import { neon } from '@neondatabase/serverless';
import { AuthCredentials, LibraryItem, User } from './myTypes';
import { cookies } from 'next/headers';
import { drizzle } from 'drizzle-orm/neon-http';
import { bookmarks, libraries, users } from '@/db/schema';
import { and, asc, desc, eq, getTableColumns, ilike, or } from 'drizzle-orm';



const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);


export async function verifyUser(credentials: AuthCredentials): Promise<User | null> {
  const [res] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    })
    .from(users)
    .where(and(eq(users.email, credentials.email), eq(users.password, credentials.password)))
    .limit(1);

  if (!res) return null;
  return res;
}


export async function createUser(name: string, email: string, password: string): Promise<User> {
  const [res] = await db
    .insert(users)
    .values({
      name: name,
      email: email,
      password: password,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    });
  return res;
}


export async function findUserByEmail(email: string): Promise<User | null> {
  const [res] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!res) return null;
  return res;
}


export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth-token')?.value;

  if (!userId) return null;

  const [res] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, Number(userId)))
    .limit(1);
  if (!res) return null;
  return res;
}


export async function getLibById(id: string | number): Promise<LibraryItem | null> {
  const [res] = await db
    .select()
    .from(libraries)
    .where(eq(libraries.id, Number(id)))
    .limit(1);
  if (!res) return null;
  return { ...res, isBookmarked: false, personalNote: null };
}




export async function getLibs(query: string = "", sort: string = "", user: User | null): Promise<LibraryItem[]> {

  const searchPattern = `%${query}%`;

  if (!user) {
    const res = await db
      .select()
      .from(libraries)
      .where(
        and(
          eq(libraries.status, 'public'),
          or(
            ilike(libraries.name, searchPattern),
            ilike(libraries.description, searchPattern)
          )
        )
      )
      .orderBy(
        sort === 'des' ? desc(libraries.id) :
          sort === 'name' ? asc(libraries.name) :
            asc(libraries.id)
      );
    return res.map(item => ({ ...item, isBookmarked: false, personalNote: null }));

  } else if (user.role === "user") {
    const res = await db
      .select({ ...getTableColumns(libraries), bookmarkId: bookmarks.id, personalNote: bookmarks.personalNote })
      .from(libraries)
      .leftJoin(bookmarks, and(eq(libraries.id, bookmarks.libraryId), eq(bookmarks.userId, user.id)))
      .where(
        and(
          or(
            eq(libraries.status, 'public'),
            eq(libraries.createdBy, user.id)
          )
          ,
          or(
            ilike(libraries.name, searchPattern),
            ilike(libraries.description, searchPattern)
          )
        )
      )
      .orderBy(
        sort === 'des' ? desc(libraries.id) :
          sort === 'name' ? asc(libraries.name) :
            asc(libraries.id)
      );

    return res.map(item => ({
      ...item,
      isBookmarked: item.bookmarkId !== null
    }));

  } else if (user.role === "admin") {
    const res = await db
      .select({ ...getTableColumns(libraries), bookmarkId: bookmarks.id, personalNote: bookmarks.personalNote })
      .from(libraries)
      .leftJoin(bookmarks, and(eq(libraries.id, bookmarks.libraryId), eq(bookmarks.userId, user.id)))
      .where(
        or(
          ilike(libraries.name, searchPattern),
          ilike(libraries.description, searchPattern)
        )
      )
      .orderBy(
        sort === 'des' ? desc(libraries.id) :
          sort === 'name' ? asc(libraries.name) :
            asc(libraries.id)
      );

    return res.map(item => ({
      ...item,
      isBookmarked: item.bookmarkId !== null
    }));
  } else {
    throw new Error("Invalid user role");
  }
}


export async function createLib(data: Omit<LibraryItem, 'id' | 'isBookmarked' | 'personalNote'>): Promise<LibraryItem> {
  const [res] = await db.insert(libraries).values(data).returning();
  return { ...res, isBookmarked: false, personalNote: null };
}


export async function updateLib(data: Omit<LibraryItem, 'isBookmarked' | 'personalNote'>): Promise<LibraryItem> {
  const [res] = await db.update(libraries)
    .set({
      name: data.name,
      category: data.category,
      description: data.description,
      installCommand: data.installCommand,
      docsUrl: data.docsUrl,
      createdBy: data.createdBy!,
      isProtected: data.isProtected,
      status: data.status,
    })
    .where(eq(libraries.id, Number(data.id)))
    .returning();
  return { ...res, isBookmarked: false, personalNote: null };
}


export async function removeLib(id: string | number): Promise<LibraryItem> {
  const [res] = await db.delete(libraries).where(eq(libraries.id, Number(id))).returning();
  return { ...res, isBookmarked: false, personalNote: null };
}


export async function toggleBookmark(libraryId: string | number, user: User): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.libraryId, Number(libraryId)), eq(bookmarks.userId, user.id)))
    .limit(1);

  if (!existing) {
    await db.insert(bookmarks).values({ userId: user.id, libraryId: Number(libraryId) });
    return true;
  } else {
    await db.delete(bookmarks).where(and(eq(bookmarks.libraryId, Number(libraryId)), eq(bookmarks.userId, user.id)));
    return false;
  }
}


export async function removeFromMyLib(libraryId: string | number, user: User): Promise<void> {
  await db.delete(bookmarks).where(and(eq(bookmarks.libraryId, Number(libraryId)), eq(bookmarks.userId, user.id)));
}


export async function updatePersonalNote(libraryId: string | number, personalNote: string | null, user: User): Promise<void> {
  await db.update(bookmarks).set({ personalNote: personalNote }).where(and(eq(bookmarks.libraryId, Number(libraryId)), eq(bookmarks.userId, user.id)));
}


export async function getBookmarkedLibs(id: string | number): Promise<LibraryItem[]> {

  const res = await db
    .select({
      ...getTableColumns(libraries),
      personalNote: bookmarks.personalNote,
    }).from(libraries)
    .innerJoin(bookmarks, eq(libraries.id, bookmarks.libraryId))
    .where(eq(bookmarks.userId, Number(id)))
    .orderBy(asc(libraries.name));

  return res.map(item => ({ ...item, isBookmarked: true }));
}


export async function setBadge(visibility: string, isProtected: boolean, id: string | number) {
  await db
    .update(libraries)
    .set({
      status: visibility as ("pending" | "private" | "public"),
      isProtected: isProtected
    })
    .where(eq(libraries.id, Number(id)));
}