import type { Topic } from "@/types/topic";

export const chapterOneTopics: Topic[] = [
  {
    id: "dbms-1-1",
    title: "Introduction to DBMS",
    description:
      "Understand what a database and database management system are and why DBMS is used.",
    definition:
      "A Database Management System (DBMS) is software that allows users to create, store, organize, retrieve, and manage data in a database.",
    realLifeExample:
      "A college management system uses a DBMS to store student details, courses, marks, attendance, and other academic information.",
    revisionPoints: [
      "DBMS is used to manage and organize data.",
      "It provides controlled access to stored data.",
      "It reduces data redundancy and improves data consistency.",
      "Examples include MySQL, PostgreSQL, Oracle, and SQL Server.",
    ],
    completed: false,
  },
  {
    id: "dbms-1-2",
    title: "Database System Architecture",
    description:
      "Learn the basic architecture of a database system and the different levels of data abstraction.",
    definition:
      "Database system architecture describes how users, applications, the DBMS, and stored data interact with each other.",
    realLifeExample:
      "When a student opens a college portal and checks marks, the application sends a request to the DBMS, which retrieves the required data from the database.",
    revisionPoints: [
      "Database architecture defines how database components interact.",
      "The three-schema architecture has external, conceptual, and internal levels.",
      "Data abstraction hides unnecessary implementation details.",
      "The architecture helps provide data independence.",
    ],
    completed: false,
  },
  {
    id: "dbms-1-3",
    title: "Data Models",
    description:
      "Understand different ways of representing the structure and relationships of data.",
    definition:
      "A data model is a collection of concepts used to describe the structure, relationships, constraints, and operations of data.",
    realLifeExample:
      "A college database can represent students, teachers, courses, and their relationships using an entity-relationship model.",
    revisionPoints: [
      "Data models describe how data is structured.",
      "Common models include hierarchical, network, relational, and object-oriented models.",
      "The relational model represents data using tables.",
      "The ER model represents entities, attributes, and relationships.",
    ],
    completed: false,
  },
  {
    id: "dbms-1-4",
    title: "Schema and Instance",
    description:
      "Learn the difference between the logical structure of a database and the actual data stored in it.",
    definition:
      "A schema is the overall logical structure of a database, while an instance is the actual collection of data stored in the database at a particular moment.",
    realLifeExample:
      "The structure of a Student table with columns such as RollNo, Name, and Branch is part of the schema, while the current student records form the instance.",
    revisionPoints: [
      "Schema represents the structure of the database.",
      "Schema generally changes less frequently.",
      "Instance represents the actual data at a specific time.",
      "Database instances change whenever data is inserted, updated, or deleted.",
    ],
    completed: false,
  },
  {
    id: "dbms-1-5",
    title: "Data Independence",
    description:
      "Understand how changes at one level of database architecture can be isolated from other levels.",
    definition:
      "Data independence is the ability to change the schema at one level of a database system without requiring changes at the next higher level.",
    realLifeExample:
      "Changing the way database files are physically stored should not require changes to the application that displays student information.",
    revisionPoints: [
      "Data independence reduces the impact of database changes.",
      "Physical data independence deals with changes to internal storage.",
      "Logical data independence deals with changes to the conceptual schema.",
      "Logical data independence is generally harder to achieve than physical data independence.",
    ],
    completed: false,
  },
];