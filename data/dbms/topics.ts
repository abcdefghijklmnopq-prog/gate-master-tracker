import type { Topic } from "@/types/topic";

export const chapterOneTopics: Topic[] = [
  {
    id: "dbms-1-1",
    title: "Introduction to DBMS",
    description:
      "Understand databases, DBMS, advantages of DBMS, database users, and basic database concepts.",
    definition:
      "A Database Management System (DBMS) is software that allows users to create, store, organize, retrieve, update, and manage data in a database efficiently.",
    realLifeExample:
      "In a college management system, student details, courses, attendance, marks, and fees can be stored and managed using a DBMS.",
    notes: `A Database is an organized collection of related data.

A DBMS is software used to manage databases.

Major functions of DBMS:
• Data storage
• Data retrieval
• Data insertion
• Data modification
• Data deletion
• Security and authorization
• Concurrency control
• Backup and recovery

Advantages of DBMS:
• Reduces data redundancy
• Improves data consistency
• Provides data security
• Supports multiple users
• Provides backup and recovery
• Provides data independence

Examples of DBMS:
• MySQL
• PostgreSQL
• Oracle
• Microsoft SQL Server
• SQLite

GATE Focus:
Remember the difference between a traditional file system and DBMS, especially redundancy, consistency, security, concurrency, and data independence.`,
    revisionPoints: [
      "DBMS is software used to manage databases.",
      "Database is an organized collection of related data.",
      "DBMS reduces data redundancy.",
      "DBMS improves data consistency.",
      "DBMS provides security and authorization.",
      "DBMS supports concurrent access by multiple users.",
      "Data independence is an important advantage of DBMS.",
    ],
    completed: false,
    youtubeVideos: [
      {
        id: "dbms-1-1-video-1",
        title: "DBMS Introduction - GATE CSE",
        url: "https://www.youtube.com/results?search_query=DBMS+Introduction+GATE+CSE",
        channel: "YouTube Search",
      },
    ],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  },

  {
    id: "dbms-1-2",
    title: "Database System Architecture",
    description:
      "Learn the three-schema architecture, external level, conceptual level, internal level, and mappings between levels.",
    definition:
      "Database system architecture describes how a database system is organized into different levels to provide abstraction and data independence.",
    realLifeExample:
      "A banking system may show customers only their account information at the external level, while the database internally stores data using files, indexes, and storage structures.",
    notes: `The ANSI/SPARC three-schema architecture divides the database into three levels.

1. External Level:
• Also called view level.
• Describes how individual users see the database.
• Different users can have different views.
• Hides unnecessary details.

2. Conceptual Level:
• Also called logical level.
• Describes the complete logical structure of the database.
• Contains entities, relationships, constraints, etc.
• Hides physical storage details.

3. Internal Level:
• Also called physical level.
• Describes how data is physically stored.
• Includes files, indexes, storage blocks, etc.

Mappings:
• External/Conceptual mapping
• Conceptual/Internal mapping

Main objective:
Provide abstraction and data independence.

GATE Focus:
External → Conceptual → Internal

External level is closest to the user.
Internal level is closest to physical storage.`,
    revisionPoints: [
      "Three-schema architecture has External, Conceptual, and Internal levels.",
      "External level is also called View level.",
      "Conceptual level represents the complete logical database.",
      "Internal level represents physical storage.",
      "External level is closest to users.",
      "Internal level is closest to storage.",
      "Three-schema architecture helps achieve data independence.",
    ],
    completed: false,
    youtubeVideos: [
      {
        id: "dbms-1-2-video-1",
        title: "Three Schema Architecture - DBMS GATE CSE",
        url: "https://www.youtube.com/results?search_query=three+schema+architecture+DBMS+GATE+CSE",
        channel: "YouTube Search",
      },
    ],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  },

  {
    id: "dbms-1-3",
    title: "Data Models",
    description:
      "Understand different types of data models and how they represent data, relationships, and constraints.",
    definition:
      "A data model is a collection of concepts used to describe the structure of a database, relationships among data, and constraints on the data.",
    realLifeExample:
      "A university database can represent students, courses, and enrollment relationships using a relational data model.",
    notes: `A data model provides concepts for describing database structure.

Important types of data models:

1. Hierarchical Model:
• Data is organized in a tree-like structure.
• Supports parent-child relationships.
• Generally represents one-to-many relationships efficiently.

2. Network Model:
• Data is represented using records and links.
• Supports more complex relationships than hierarchical models.

3. Relational Model:
• Data is represented using tables.
• Rows are called tuples.
• Columns are called attributes.
• Most commonly used database model.

4. Entity-Relationship Model:
• Represents entities, attributes, and relationships.
• Commonly used during database design.

5. Object-Oriented Model:
• Represents data using objects.
• Supports concepts such as inheritance and encapsulation.

Relational Model:
Relation → Table
Tuple → Row
Attribute → Column

GATE Focus:
Be very clear about tuple, attribute, relation, cardinality, and keys in the relational model.`,
    revisionPoints: [
      "Data model describes database structure and relationships.",
      "Hierarchical model uses a tree-like structure.",
      "Network model supports complex relationships using links.",
      "Relational model represents data using tables.",
      "Tuple means row in a relation.",
      "Attribute means column in a relation.",
      "ER model uses entities, attributes, and relationships.",
    ],
    completed: false,
    youtubeVideos: [
      {
        id: "dbms-1-3-video-1",
        title: "Data Models - DBMS GATE CSE",
        url: "https://www.youtube.com/results?search_query=data+models+DBMS+GATE+CSE",
        channel: "YouTube Search",
      },
    ],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  },

  {
    id: "dbms-1-4",
    title: "Schema and Instance",
    description:
      "Understand the difference between database schema and instance and why the distinction is important in DBMS.",
    definition:
      "Schema is the overall logical structure or design of a database, while an instance is the actual data stored in the database at a particular moment.",
    realLifeExample:
      "The structure of a Student table containing RollNo, Name, and Marks is the schema. The actual student records currently stored in that table form the instance.",
    notes: `Schema:
• Defines the structure of the database.
• Describes tables, attributes, relationships, and constraints.
• Usually changes less frequently.
• Can be considered the blueprint of the database.

Instance:
• Represents the actual contents of the database at a particular point in time.
• Changes whenever data is inserted, deleted, or updated.
• Also called the state of the database.

Example:

Student(RollNo, Name, Marks)

The definition of this table is part of the schema.

Actual records such as:
101, Rahul, 85
102, Amit, 78

are part of the current instance.

Important Difference:

Schema → Structure
Instance → Actual data

GATE Focus:
Schema is relatively stable, whereas instance changes frequently.`,
    revisionPoints: [
      "Schema represents the structure of the database.",
      "Instance represents actual data at a particular time.",
      "Schema changes relatively infrequently.",
      "Instance can change frequently.",
      "Schema can be considered the blueprint of a database.",
      "Insert, update, or delete operations change the instance.",
    ],
    completed: false,
    youtubeVideos: [
      {
        id: "dbms-1-4-video-1",
        title: "Schema vs Instance - DBMS GATE CSE",
        url: "https://www.youtube.com/results?search_query=schema+vs+instance+DBMS+GATE+CSE",
        channel: "YouTube Search",
      },
    ],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  },

  {
    id: "dbms-1-5",
    title: "Data Independence",
    description:
      "Learn physical and logical data independence and understand their relationship with database abstraction.",
    definition:
      "Data independence is the ability to change the schema at one level of a database system without requiring changes at the next higher level.",
    realLifeExample:
      "Changing the physical storage method or adding an index should not require changes to application programs that access the database.",
    notes: `Data independence allows changes at one schema level without affecting higher levels.

There are two major types:

1. Physical Data Independence:
Ability to change the internal/physical schema without changing the conceptual schema.

Examples:
• Changing file organization
• Changing indexes
• Changing storage structures
• Changing physical storage methods

Physical data independence is generally easier to achieve.

2. Logical Data Independence:
Ability to change the conceptual schema without changing external schemas or application programs.

Examples:
• Adding a new attribute
• Adding a new relationship
• Changing the logical structure

Logical data independence is generally harder to achieve than physical data independence.

Hierarchy:

External Level
      ↓
Conceptual Level
      ↓
Internal Level

Physical Data Independence:
Internal changes should not affect Conceptual level.

Logical Data Independence:
Conceptual changes should not affect External level.

GATE Focus:
Physical Data Independence → Internal ↔ Conceptual

Logical Data Independence → Conceptual ↔ External

Remember:
Logical data independence is harder to achieve than physical data independence.`,
    revisionPoints: [
      "Data independence allows schema changes without affecting higher levels.",
      "Physical data independence deals with internal-level changes.",
      "Logical data independence deals with conceptual-level changes.",
      "Physical data independence is easier to achieve.",
      "Logical data independence is harder to achieve.",
      "Changing indexes is an example of physical-level change.",
      "Changing the conceptual schema relates to logical data independence.",
    ],
    completed: false,
    youtubeVideos: [
      {
        id: "dbms-1-5-video-1",
        title: "Data Independence - DBMS GATE CSE",
        url: "https://www.youtube.com/results?search_query=data+independence+DBMS+GATE+CSE",
        channel: "YouTube Search",
      },
    ],
    progress: {
      notesCompleted: false,
      videosCompleted: false,
      revisionCompleted: false,
      pyqsCompleted: false,
    },
  },
];