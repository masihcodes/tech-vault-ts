import { neon } from '@neondatabase/serverless';
import { LibraryItem } from './useLibStore';


const sql = neon(process.env.DATABASE_URL!);



export async function getLibs(query: string = "", sort: string = ""): Promise<LibraryItem[]> {

  const searchPattern = `%${query}%`;

  let libraries;
  if (sort === "asc") {
    libraries = await sql`
      SELECT * FROM libraries 
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY id ASC
    `;
  } else if (sort === "des") {
    libraries = await sql`
      SELECT * FROM libraries 
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY id DESC
    `;
  } else if (sort === "name") {
    libraries = await sql`
      SELECT * FROM libraries 
      WHERE name ILIKE ${searchPattern} OR description ILIKE ${searchPattern}
      ORDER BY LOWER(name) ASC
    `;
  } else {
    libraries = await sql`
      SELECT * FROM libraries 
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
    INSERT INTO libraries (name, category, description, installCommand, docsUrl, isBookmarked, personalNote)
    VALUES (${data.name}, ${data.category}, ${data.description}, ${data.installCommand}, ${data.docsUrl}, false, NULL)
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
    isBookmarked: lib.isbookmarked,
    personalNote: lib.personalnote
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
      docsUrl = ${data.docsUrl},
      isBookmarked = ${data.isBookmarked},
      personalNote = ${data.personalNote ?? null}
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
    isBookmarked: lib.isbookmarked,
    personalNote: lib.personalnote
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