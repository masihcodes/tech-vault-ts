"use server";
import { neon } from '@neondatabase/serverless';
import { AuthCredentials, LibraryItem, User } from './myTypes';
import { cookies } from 'next/headers';



const sql = neon(process.env.DATABASE_URL!);



export async function verifyUser(credentials: AuthCredentials): Promise<User | null> {
  const users = await sql`
    SELECT id, name, email FROM users
    WHERE email = ${credentials.email} AND password = ${credentials.password}
  `;

  if (users.length === 0) return null;

  const user = users[0];
  return { id: user.id as number, name: user.name as string, email: user.email as string, };
}


export async function createUser(name: string, email: string, password: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;

  const user = result[0];
  return { id: user.id as number, name: user.name as string, email: user.email as string, };
}


export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await sql`
    SELECT id, name, email FROM users WHERE email = ${email}
  `;

  if (users.length === 0) return null;

  const user = users[0];
  return { id: user.id as number, name: user.name as string, email: user.email as string, };
}


export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth-token')?.value;

  if (!userId) return null;

  try {
    const users = await sql`SELECT id, name, email FROM users WHERE id = ${userId}`;
    if (users.length === 0) return null;
    return { id: users[0].id as number, name: users[0].name as string, email: users[0].email as string };
  } catch {
    return null;
  }
}









export async function getLibs(query: string = "", sort: string = ""): Promise<LibraryItem[]> {

  const searchPattern = `%${query}%`;

  const user = await getSessionUser();

  let libraries;

  if (user) {
    if (sort === 'des') {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${user?.id}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY l.id DESC
      `;
    } else if (sort === 'name') {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${user?.id}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY LOWER(l.name) ASC
      `;
    } else {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${user?.id}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY l.id ASC
      `;
    }
  } else {
    libraries = await sql`
      SELECT *, false AS isbookmarked, NULL AS personalnote
      FROM libraries
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY id ASC
    `;
  }


  return libraries.map(lib => ({
    id: lib.id,
    name: lib.name,
    category: lib.category,
    description: lib.description,
    installCommand: lib.installcommand,
    docsUrl: lib.docsurl,
    isBookmarked: lib.isbookmarked,
    personalNote: lib.personalnote
  }));
}


export async function createLib(data: Omit<LibraryItem, 'id'>): Promise<LibraryItem> {
  const newLib = await sql`
    INSERT INTO libraries (name, category, description, installCommand, docsUrl)
    VALUES (${data.name}, ${data.category}, ${data.description}, ${data.installCommand}, ${data.docsUrl})
    RETURNING *;
  `;

  const lib = newLib[0];
  return {
    id: lib.id,
    name: lib.name,
    category: lib.category,
    description: lib.description,
    installCommand: lib.installcommand,
    docsUrl: lib.docsurl,
    isBookmarked: false,
    personalNote: null
  };;
}


export async function updateLib(data: LibraryItem): Promise<LibraryItem> {

  const updatedLib = await sql`
    UPDATE libraries
    SET 
      name = ${data.name},
      category = ${data.category},
      description = ${data.description},
      installCommand = ${data.installCommand},
      docsUrl = ${data.docsUrl}
    WHERE id = ${data.id}
    RETURNING *;
  `;

  const lib = updatedLib[0];
  return {
    id: lib.id,
    name: lib.name,
    category: lib.category,
    description: lib.description,
    installCommand: lib.installcommand,
    docsUrl: lib.docsurl,
    isBookmarked: false,
    personalNote: null
  };
}


export async function removeLib(id: string | number) {
  const deletedLib = await sql`
    DELETE FROM libraries
    WHERE id = ${id}
    RETURNING *;
  `;

  const lib = deletedLib[0];
  return {
    id: lib.id,
    name: lib.name,
    category: lib.category,
    description: lib.description,
    installCommand: lib.installcommand,
    docsUrl: lib.docsurl,
    isBookmarked: lib.isbookmarked,
    personalNote: lib.personalnote
  };
}


export async function toggleBookmark(libraryId: string | number, user: User): Promise<boolean> {

  const existing = await sql`
    SELECT id FROM bookmarks
    WHERE user_id = ${user.id} AND library_id = ${libraryId}
  `;

  if (existing.length > 0) {
    await sql`
      DELETE FROM bookmarks
      WHERE user_id = ${user.id} AND library_id = ${libraryId}
    `;
    return false;
  }

  await sql`
    INSERT INTO bookmarks (user_id, library_id)
    VALUES (${user.id}, ${libraryId})
  `;
  return true;
}


export async function removeFromMyLib(libraryId: string | number, user: User): Promise<void> {
  await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${user.id} AND library_id = ${libraryId}
  `;
}


export async function updatePersonalNote(libraryId: string | number, personalNote: string | null, user: User): Promise<void> {
  await sql`
    UPDATE bookmarks
    SET personalnote = ${personalNote}
    WHERE user_id = ${user.id} AND library_id = ${libraryId}
  `;
}


export async function getBookmarkedLibs(id: string | number): Promise<LibraryItem[]> {


  const libraries = await sql`
    SELECT l.*, true AS isbookmarked, b.personalnote
    FROM libraries l
    INNER JOIN bookmarks b ON b.library_id = l.id
    WHERE b.user_id = ${id}
    ORDER BY l.name ASC
  `;

  return libraries.map(lib => ({
    id: lib.id,
    name: lib.name,
    category: lib.category,
    description: lib.description,
    installCommand: lib.installcommand,
    docsUrl: lib.docsurl,
    isBookmarked: lib.isbookmarked,
    personalNote: lib.personalnote
  }));
}