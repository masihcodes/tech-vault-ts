import { neon } from '@neondatabase/serverless';
import { AuthCredentials, User } from './authTypes';
import { LibraryItem } from './useLibStore';

const sql = neon(process.env.DATABASE_URL!);

function mapLibraryRow(lib: Record<string, unknown>): LibraryItem {
  return {
    id: lib.id as number,
    name: lib.name as string,
    category: lib.category as string,
    description: lib.description as string,
    installCommand: lib.installcommand as string,
    docsUrl: lib.docsurl as string,
    isBookmarked: Boolean(lib.isbookmarked),
    personalNote: (lib.personalnote as string | null) ?? null,
  };
}

export async function verifyUser(credentials: AuthCredentials): Promise<User | null> {
  const users = await sql`
    SELECT id, name, email FROM users
    WHERE email = ${credentials.email} AND password = ${credentials.password}
  `;

  if (users.length === 0) return null;

  const user = users[0];
  return {
    id: user.id as number,
    name: user.name as string,
    email: user.email as string,
  };
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;

  const user = result[0];
  return {
    id: user.id as number,
    name: user.name as string,
    email: user.email as string,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await sql`
    SELECT id, name, email FROM users WHERE email = ${email}
  `;

  if (users.length === 0) return null;

  const user = users[0];
  return {
    id: user.id as number,
    name: user.name as string,
    email: user.email as string,
  };
}

export async function getLibs(
  query: string = '',
  sort: string = '',
  credentials?: AuthCredentials | null,
): Promise<LibraryItem[]> {
  const searchPattern = `%${query}%`;
  let userId: number | null = null;

  if (credentials?.email && credentials?.password) {
    const user = await verifyUser(credentials);
    if (user) userId = user.id;
  }

  let libraries;

  if (userId !== null) {
    if (sort === 'des') {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${userId}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY l.id DESC
      `;
    } else if (sort === 'name') {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${userId}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY LOWER(l.name) ASC
      `;
    } else {
      libraries = await sql`
        SELECT l.*, (b.id IS NOT NULL) AS isbookmarked, b.personalnote
        FROM libraries l
        LEFT JOIN bookmarks b ON b.library_id = l.id AND b.user_id = ${userId}
        WHERE l.name ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern}
        ORDER BY l.id ASC
      `;
    }
  } else if (sort === 'des') {
    libraries = await sql`
      SELECT *, false AS isbookmarked, NULL AS personalnote
      FROM libraries
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY id DESC
    `;
  } else if (sort === 'name') {
    libraries = await sql`
      SELECT *, false AS isbookmarked, NULL AS personalnote
      FROM libraries
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY LOWER(name) ASC
    `;
  } else {
    libraries = await sql`
      SELECT *, false AS isbookmarked, NULL AS personalnote
      FROM libraries
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY id ASC
    `;
  }

  return libraries.map(mapLibraryRow);
}

export async function getBookmarkedLibs(credentials: AuthCredentials): Promise<LibraryItem[]> {
  const user = await verifyUser(credentials);
  if (!user) return [];

  const libraries = await sql`
    SELECT l.*, true AS isbookmarked, b.personalnote
    FROM libraries l
    INNER JOIN bookmarks b ON b.library_id = l.id
    WHERE b.user_id = ${user.id}
    ORDER BY l.name ASC
  `;

  return libraries.map(mapLibraryRow);
}

export async function toggleBookmark(
  libraryId: string | number,
  credentials: AuthCredentials,
): Promise<boolean> {
  const user = await verifyUser(credentials);
  if (!user) throw new Error('Invalid email or password');

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

export async function removeBookmark(
  libraryId: string | number,
  credentials: AuthCredentials,
): Promise<void> {
  const user = await verifyUser(credentials);
  if (!user) throw new Error('Invalid email or password');

  await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${user.id} AND library_id = ${libraryId}
  `;
}

export async function updateBookmarkNote(
  libraryId: string | number,
  personalNote: string | null,
  credentials: AuthCredentials,
): Promise<void> {
  const user = await verifyUser(credentials);
  if (!user) throw new Error('Invalid email or password');

  await sql`
    UPDATE bookmarks
    SET personalnote = ${personalNote}
    WHERE user_id = ${user.id} AND library_id = ${libraryId}
  `;
}

export async function createLib(data: Omit<LibraryItem, 'id'>): Promise<LibraryItem> {
  const newLib = await sql`
    INSERT INTO libraries (name, category, description, installcommand, docsurl)
    VALUES (${data.name}, ${data.category}, ${data.description}, ${data.installCommand}, ${data.docsUrl})
    RETURNING *
  `;

  return mapLibraryRow({ ...newLib[0], isbookmarked: false, personalnote: null });
}

export async function updateLib(data: LibraryItem): Promise<LibraryItem> {
  const updatedLib = await sql`
    UPDATE libraries
    SET
      name = ${data.name},
      category = ${data.category},
      description = ${data.description},
      installcommand = ${data.installCommand},
      docsurl = ${data.docsUrl}
    WHERE id = ${data.id}
    RETURNING *
  `;

  return mapLibraryRow({
    ...updatedLib[0],
    isbookmarked: data.isBookmarked,
    personalnote: data.personalNote,
  });
}

export async function removeLib(id: string | number) {
  const deletedLib = await sql`
    DELETE FROM libraries
    WHERE id = ${id}
    RETURNING *
  `;

  return mapLibraryRow({ ...deletedLib[0], isbookmarked: false, personalnote: null });
}
