SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict PjoSqWK8Dr11GKDLkbSX23X2EAavU79UrDQ3ssCPFyn9lesvC8VBEufgMZp3zQ9

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subjects" ("id", "name", "description", "created_at") VALUES
	('dbms', 'Database Management Systems', 'Learn DBMS concepts, architecture, data models, normalization, transactions, indexing, and other GATE CSE topics.', '2026-09-04 04:24:33.804837+00');


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chapters" ("id", "subject_id", "title", "description", "created_at") VALUES
	('dbms-chapter-1', 'dbms', 'Introduction to DBMS', 'Learn the fundamental concepts of database management systems, data models, architecture, schema, instances, and data independence.', '2026-09-04 04:24:33.804837+00'),
	('dbms-chapter-2', 'dbms', 'ER Model', 'Learn entities, attributes, relationships, keys, constraints, weak entities, ER diagrams, and ER to relational mapping.', '2026-09-04 10:20:55.91833+00'),
	('dbms-chapter-3', 'dbms', 'Relational Model & SQL', 'Learn the relational model, relational algebra, tuple relational calculus, integrity constraints, functional dependencies, and SQL.', '2026-09-04 10:20:55.91833+00'),
	('dbms-chapter-4', 'dbms', 'Normalization', 'Learn functional dependencies, attribute closure, candidate keys, Armstrong axioms, normal forms, and decomposition.', '2026-09-04 10:20:55.91833+00'),
	('dbms-chapter-5', 'dbms', 'File Organization & Indexing', 'Learn file organization, hashing, indexes, multilevel indexing, B-Trees, and B+ Trees.', '2026-09-04 10:20:55.91833+00'),
	('dbms-chapter-6', 'dbms', 'Transactions & Concurrency Control', 'Learn transactions, ACID properties, schedules, serializability, recoverability, locking, 2PL, deadlocks, timestamps, and recovery.', '2026-09-04 10:20:55.91833+00');


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."topics" ("id", "chapter_id", "title", "description", "definition", "real_life_example", "notes", "revision_points", "created_at", "youtube_videos") VALUES
	('dbms-1-1', 'dbms-chapter-1', 'Introduction to DBMS', 'Understand what a database and database management system are, why DBMS is needed, and its advantages over traditional file systems.', 'A Database Management System (DBMS) is software that allows users to create, store, organize, retrieve, update, and manage data in a database.', 'A college management system uses a DBMS to store student details, courses, marks, attendance, fees, and other academic information.', '
A DBMS is a software system used to manage databases efficiently.

A database is an organized collection of related data. The DBMS acts as an interface between users/applications and the database.

Why do we need DBMS?

1. Data redundancy:
   The same data may be stored multiple times in a traditional file system. DBMS helps reduce unnecessary duplication.

2. Data consistency:
   When duplicate data exists, updating one copy but not another can create inconsistency. DBMS helps maintain consistent data.

3. Data security:
   DBMS provides mechanisms to control who can access particular data.

4. Data sharing:
   Multiple users and applications can access the same database.

5. Data integrity:
   DBMS allows constraints and rules to ensure that stored data remains valid.

6. Backup and recovery:
   DBMS provides mechanisms to recover data after failures.

7. Concurrent access:
   Multiple users can work with the database while the DBMS manages conflicts.

Traditional File System vs DBMS:

File System:
- Higher data redundancy
- Limited security
- Difficult data sharing
- Difficult backup and recovery
- Program-data dependence

DBMS:
- Reduced redundancy
- Better security
- Controlled data sharing
- Backup and recovery support
- Data independence

Common DBMS examples:
MySQL, PostgreSQL, Oracle Database, Microsoft SQL Server, and SQLite.

GATE Focus:
Remember the major advantages of DBMS:
reduced redundancy, improved consistency, security, integrity, concurrency control, backup/recovery, and data independence.
', '["DBMS is software used to create, store, retrieve, update, and manage data.", "A database is an organized collection of related data.", "DBMS reduces data redundancy and improves data consistency.", "DBMS provides security, integrity, concurrency control, and recovery.", "DBMS supports controlled data sharing among multiple users.", "Program-data dependence is a major limitation of traditional file systems.", "Data independence is an important advantage of DBMS."]', '2026-09-04 04:24:33.804837+00', '[{"id": "dbms-1-1-video-1", "url": "https://www.youtube.com/results?search_query=DBMS+Introduction+GATE+CSE", "title": "DBMS Introduction - GATE CSE", "channel": "YouTube Search"}]'),
	('dbms-1-2', 'dbms-chapter-1', 'Database System Architecture', 'Learn the basic architecture of a database system, the three-schema architecture, and the different levels of data abstraction.', 'Database system architecture describes how users, applications, the DBMS, and stored data interact with each other.', 'When a student opens a college portal and checks marks, the application sends a request to the DBMS, which retrieves the required data from the database.', '
Database system architecture explains how a database system is organized and how different users interact with stored data.

Three-Schema Architecture:

1. External Level:
   This is the highest level.
   It represents the database from the viewpoint of individual users.
   Different users can have different views of the same database.

2. Conceptual Level:
   This is the middle level.
   It describes the complete logical structure of the database.
   It contains entities, relationships, constraints, and other logical details.

3. Internal Level:
   This is the lowest level.
   It describes how data is physically stored in storage devices.

Data Abstraction:

Data abstraction means hiding unnecessary implementation details from users.

The three levels provide abstraction:

External Level
      ↓
Conceptual Level
      ↓
Internal Level

Data Independence:

Data independence means that changes at one level should not require changes at the higher level.

Two types:

Physical Data Independence:
Ability to change the internal schema without changing the conceptual schema.

Example:
Changing file organization or storage structure without changing the logical database design.

Logical Data Independence:
Ability to change the conceptual schema without changing external schemas or application programs.

Example:
Adding a new attribute to a database without changing existing user views.

Important GATE Point:
Physical data independence is generally easier to achieve than logical data independence.
', '["Three-schema architecture has external, conceptual, and internal levels.", "External level represents individual user views.", "Conceptual level represents the complete logical structure of the database.", "Internal level describes physical storage of data.", "Data abstraction hides unnecessary implementation details.", "Physical data independence concerns changes in internal storage.", "Logical data independence concerns changes in the conceptual schema.", "Physical data independence is generally easier than logical data independence."]', '2026-09-04 04:24:33.804837+00', '[{"id": "dbms-1-2-video-1", "url": "https://www.youtube.com/results?search_query=three+schema+architecture+DBMS+GATE+CSE", "title": "Three Schema Architecture - GATE CSE", "channel": "YouTube Search"}]'),
	('dbms-1-3', 'dbms-chapter-1', 'Data Models', 'Understand different ways of representing the structure, relationships, constraints, and organization of data.', 'A data model is a collection of concepts used to describe the structure, relationships, constraints, and operations of data.', 'A college database can represent students, teachers, courses, and their relationships using an entity-relationship model.', '
A data model provides a way to describe how data is structured and how different pieces of data are related.

Major types of data models:

1. Hierarchical Model:
   Data is organized in a tree-like structure.
   Each child generally has one parent.
   It represents one-to-many relationships naturally.

2. Network Model:
   Data is represented using records connected through links.
   It can represent more complex relationships than the hierarchical model.

3. Relational Model:
   Data is represented using tables.
   Rows represent tuples/records and columns represent attributes.
   It is one of the most widely used database models.

4. Entity-Relationship Model:
   Used mainly for conceptual database design.
   It represents entities, attributes, and relationships.

5. Object-Oriented Model:
   Represents data using objects, classes, inheritance, and other object-oriented concepts.

Relational Model:

Example:

Student
--------------------------------
RollNo | Name | Branch
--------------------------------
101    | Rahul| CSE
102    | Amit | CSE
--------------------------------

Here:
- Student is a relation/table.
- RollNo, Name, and Branch are attributes.
- Each row is a tuple.

ER Model:

Important concepts:
- Entity
- Attribute
- Relationship
- Entity Set
- Relationship Set

GATE Focus:
Be clear about the difference between a data model and a database schema.

A data model provides concepts for describing a database.
A schema is the actual structure/design of a particular database.
', '["A data model describes the structure and relationships of data.", "Hierarchical model represents data using a tree-like structure.", "Network model uses records and links to represent relationships.", "Relational model represents data using tables.", "ER model uses entities, attributes, and relationships.", "Object-oriented model uses objects and classes.", "A data model provides concepts for describing database structure.", "Relational databases are based on the relational data model."]', '2026-09-04 04:24:33.804837+00', '[{"id": "dbms-1-3-video-1", "url": "https://www.youtube.com/results?search_query=data+models+DBMS+GATE+CSE", "title": "Data Models in DBMS - GATE CSE", "channel": "YouTube Search"}]'),
	('dbms-1-4', 'dbms-chapter-1', 'Schema and Instance', 'Learn the difference between the logical structure of a database and the actual data stored in it at a particular moment.', 'A schema is the overall logical structure or design of a database, while an instance is the actual collection of data stored in the database at a particular moment.', 'The structure of a Student table with columns such as RollNo, Name, and Branch is part of the schema, while the current student records form the instance.', '
Schema and instance are two fundamental concepts in DBMS.

Schema:

A schema describes the structure or design of a database.

For example:

Student(
    RollNo,
    Name,
    Branch,
    CGPA
)

This structure is the schema of the Student relation.

Instance:

An instance is the actual data present in the database at a particular point in time.

Example:

RollNo | Name  | Branch | CGPA
--------------------------------
101    | Rahul | CSE    | 8.5
102    | Amit  | CSE    | 8.1

The above records represent an instance of the Student relation.

Important Difference:

Schema:
- Defines structure.
- Changes relatively infrequently.
- Also called database design in a general sense.

Instance:
- Represents actual data.
- Changes frequently.
- Changes whenever records are inserted, deleted, or updated.

Simple Example:

Think of a college attendance register.

The format:
Roll No | Name | Attendance

is similar to the schema.

The actual student entries filled into that register represent an instance.

GATE Focus:
Schema = structure/design.
Instance = actual data at a particular time.

Do not confuse schema with instance.
', '["Schema represents the structure/design of a database.", "Instance represents actual data at a particular point in time.", "Schema usually changes less frequently.", "Instance changes whenever data is inserted, deleted, or updated.", "Table structure is part of the schema.", "Rows containing actual records form an instance.", "Schema and instance are distinct concepts."]', '2026-09-04 04:24:33.804837+00', '[{"id": "dbms-1-4-video-1", "url": "https://www.youtube.com/results?search_query=schema+vs+instance+DBMS+GATE+CSE", "title": "Schema vs Instance in DBMS - GATE CSE", "channel": "YouTube Search"}]'),
	('dbms-2-7', 'dbms-chapter-2', 'ER Diagram Notations', 'Learn standard ER diagram symbols and how entities, attributes, and relationships are represented.', 'ER diagram notation provides graphical symbols for representing entities, attributes, relationships, and constraints.', 'A rectangle can represent an entity such as Student, an oval can represent an attribute such as Name, and a diamond can represent a relationship such as Enrolls.', 'ER diagrams provide a visual representation of database requirements before relational tables are created.', '["Rectangle represents entity set", "Oval represents attribute", "Diamond represents relationship", "Double rectangle represents weak entity", "Double oval represents multi-valued attribute"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-7", "url": "https://www.youtube.com/results?search_query=ER+diagram+notations+DBMS+GATE+CSE", "title": "ER Diagram Notations DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-1-5', 'dbms-chapter-1', 'Data Independence', 'Understand how changes at one level of database architecture can be isolated from other levels.', 'Data independence is the ability to change the schema at one level of a database system without requiring changes at the next higher level.', 'Changing the way database files are physically stored should not require changes to the application that displays student information.', '
Data independence is one of the major advantages of the three-schema architecture.

Definition:

Data independence means that changes made at one level of database architecture should not require changes at the higher level.

There are two types.

1. Physical Data Independence:

It is the ability to modify the internal schema without changing the conceptual schema.

Examples:
- Changing file organization.
- Changing indexes.
- Changing storage structures.
- Changing physical storage methods.

The logical structure of the database remains unchanged.

2. Logical Data Independence:

It is the ability to modify the conceptual schema without changing external schemas or application programs.

Examples:
- Adding a new attribute.
- Adding a new relation.
- Modifying relationships at the conceptual level while keeping user views unaffected.

Comparison:

Physical Data Independence:
Internal Schema
      ↓
Conceptual Schema remains unchanged

Logical Data Independence:
Conceptual Schema
      ↓
External Schemas remain unchanged

Important GATE Point:

Logical data independence is generally harder to achieve than physical data independence.

Why?

Changes to the conceptual schema can affect user views and application programs, whereas many physical storage changes can remain hidden from the logical database structure.

Remember:

Physical = storage changes.

Logical = logical database structure changes.
', '["Data independence isolates changes between different schema levels.", "Physical data independence deals with changes to the internal schema.", "Logical data independence deals with changes to the conceptual schema.", "Physical data independence does not require changes to the conceptual schema.", "Logical data independence should protect external schemas and applications from conceptual changes.", "Logical data independence is generally harder to achieve.", "Physical independence is mainly concerned with storage-level changes.", "Logical independence is mainly concerned with logical database design changes."]', '2026-09-04 04:24:33.804837+00', '[{"id": "dbms-1-5-video-1", "url": "https://www.youtube.com/results?search_query=data+independence+DBMS+GATE+CSE", "title": "Data Independence in DBMS - GATE CSE", "channel": "YouTube Search"}]'),
	('dbms-2-1', 'dbms-chapter-2', 'Entity, Entity Set & Attributes', 'Understand entities, entity sets, and attributes used to represent real-world objects in a database.', 'An entity is a uniquely identifiable real-world object, while an entity set is a collection of similar entities. Attributes describe the properties of an entity.', 'In a college database, a particular student is an entity, Students is an entity set, and roll number, name, and age are attributes.', 'An entity represents one real-world object. An entity set represents a collection of similar entities. Attributes describe entities.', '["Entity = uniquely identifiable object", "Entity set = collection of similar entities", "Attributes describe properties of entities", "Entity and entity set are different concepts"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-1", "url": "https://www.youtube.com/results?search_query=entity+entity+set+attributes+DBMS+GATE+CSE", "title": "Entity Entity Set Attributes DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-2-2', 'dbms-chapter-2', 'Types of Attributes', 'Learn simple, composite, single-valued, multi-valued, derived, and stored attributes.', 'Attributes can be classified based on how their values are structured, stored, and derived.', 'A student address can be a composite attribute containing street, city, and PIN code. Age can be a derived attribute calculated from date of birth.', 'Common attribute types include simple, composite, single-valued, multi-valued, derived, and stored attributes.', '["Simple attribute cannot be divided further", "Composite attribute can be divided into components", "Multi-valued attribute can have multiple values", "Derived attribute is calculated from another attribute"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-2", "url": "https://www.youtube.com/results?search_query=types+of+attributes+ER+model+DBMS+GATE+CSE", "title": "Types of Attributes ER Model DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-2-3', 'dbms-chapter-2', 'Keys', 'Understand super keys, candidate keys, primary keys, alternate keys, and foreign keys.', 'A key is an attribute or set of attributes used to uniquely identify tuples or establish relationships between relations.', 'In a student table, roll_number can uniquely identify each student and can therefore serve as a candidate key and primary key.', 'Keys are fundamental for identification and relationships in relational databases.', '["Super key uniquely identifies a tuple", "Candidate key is a minimal super key", "Primary key is the selected candidate key", "Foreign key references a key in another relation"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-3", "url": "https://www.youtube.com/results?search_query=keys+in+DBMS+ER+model+GATE+CSE", "title": "Keys in DBMS ER Model GATE CSE", "channel": "YouTube"}]'),
	('dbms-2-4', 'dbms-chapter-2', 'Relationships & Relationship Sets', 'Learn how entities participate in relationships and how relationship sets are represented.', 'A relationship represents an association among entities, while a relationship set is a collection of similar relationships.', 'A Student enrolls in a Course. Enrolls is the relationship between Student and Course entities.', 'Relationships connect entities and may involve two or more entity sets.', '["Relationship represents association between entities", "Relationship set contains similar relationships", "Binary relationship involves two entity sets", "Higher-degree relationships can involve more than two entity sets"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-4", "url": "https://www.youtube.com/results?search_query=relationships+relationship+sets+ER+model+GATE+CSE", "title": "Relationships Relationship Sets ER Model GATE", "channel": "YouTube"}]'),
	('dbms-2-5', 'dbms-chapter-2', 'Cardinality & Participation Constraints', 'Understand mapping cardinalities and participation constraints in ER models.', 'Cardinality specifies how many entities can participate in a relationship, while participation specifies whether participation is mandatory or optional.', 'A student can enroll in many courses and a course can have many students, representing a many-to-many relationship.', 'Cardinality types include one-to-one, one-to-many, many-to-one, and many-to-many. Participation can be total or partial.', '["1:1 = one-to-one", "1:N = one-to-many", "N:1 = many-to-one", "M:N = many-to-many", "Total participation means every entity must participate"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-5", "url": "https://www.youtube.com/results?search_query=cardinality+participation+constraints+ER+model+GATE+CSE", "title": "Cardinality Participation Constraints ER Model", "channel": "YouTube"}]'),
	('dbms-2-6', 'dbms-chapter-2', 'Weak Entity Sets', 'Learn weak entities, identifying relationships, and partial keys.', 'A weak entity is an entity that cannot be uniquely identified using only its own attributes and depends on a strong entity for identification.', 'A dependent may be identified using the employee ID of an employee along with the dependent name.', 'Weak entities depend on strong entities and are identified using a partial key together with the owner entity key.', '["Weak entity has no complete key of its own", "It depends on a strong entity", "Identifying relationship connects weak and strong entities", "Partial key helps identify weak entities"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-6", "url": "https://www.youtube.com/results?search_query=weak+entity+set+DBMS+GATE+CSE", "title": "Weak Entity Set DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-2-8', 'dbms-chapter-2', 'Extended ER Model', 'Learn specialization, generalization, inheritance, and category concepts in the Enhanced ER model.', 'The Extended ER model adds advanced concepts such as specialization, generalization, and inheritance to the basic ER model.', 'An Employee entity can be specialized into Manager and Engineer subclasses that inherit common Employee attributes.', 'EER models are useful when real-world entities have hierarchical or specialized structures.', '["Specialization creates subclasses from a superclass", "Generalization combines similar entity sets", "Subclasses inherit attributes", "EER extends the basic ER model"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-8", "url": "https://www.youtube.com/results?search_query=extended+ER+model+DBMS+GATE+CSE", "title": "Extended ER Model DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-2-9', 'dbms-chapter-2', 'ER to Relational Mapping', 'Learn how entities, relationships, attributes, and constraints are converted into relational tables.', 'ER to relational mapping is the process of transforming an ER model into a relational database schema.', 'A Student entity becomes a Student table, while a many-to-many Enrolls relationship can become a separate table containing student and course keys.', 'Different ER constructs require different mapping rules when converting an ER diagram into relations.', '["Strong entity becomes a relation", "Attributes become columns", "Primary key of entity becomes relation key", "Many-to-many relationships generally become separate relations", "Weak entities require the owner key"]', '2026-09-04 10:24:33.658959+00', '[{"id": "yt-dbms-2-9", "url": "https://www.youtube.com/results?search_query=ER+to+relational+mapping+DBMS+GATE+CSE", "title": "ER to Relational Mapping DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-1', 'dbms-chapter-3', 'Relational Model Basics', 'Understand relations, tuples, attributes, domains, and the basic structure of the relational model.', 'A Student relation can contain attributes such as RollNo, Name, Branch, and Age, with each row representing one student.', 'The relational model represents data using relations, commonly implemented as tables.', 'A relation consists of tuples and attributes. Each attribute has a domain of allowed values.', '["Relation is commonly represented as a table", "Tuple represents a row", "Attribute represents a column", "Domain defines allowed values of an attribute", "Order of rows and columns is not logically significant"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-1", "url": "https://www.youtube.com/results?search_query=relational+model+basics+DBMS+GATE+CSE", "title": "Relational Model Basics DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-2', 'dbms-chapter-3', 'Relational Algebra', 'Learn relational algebra as a procedural query language used to manipulate relations.', 'Relational algebra is a formal procedural query language consisting of operations that take relations as input and produce relations as output.', 'A database query asking for students from the CSE branch can be represented using relational algebra operations.', 'Relational algebra forms an important theoretical foundation for relational databases and query processing.', '["Relational algebra is procedural", "Input and output are relations", "Basic operations include selection and projection", "Relational algebra is used in query processing"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-2", "url": "https://www.youtube.com/results?search_query=relational+algebra+DBMS+GATE+CSE", "title": "Relational Algebra DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-3', 'dbms-chapter-3', 'Relational Algebra Operations', 'Master selection, projection, union, intersection, difference, Cartesian product, and join operations.', 'Relational algebra operations transform one or more relations into another relation while preserving relational properties.', 'Selection can filter students with age greater than 20, while projection can retrieve only student names.', 'Important operations include selection, projection, union, set difference, Cartesian product, and joins.', '["Selection filters rows", "Projection selects columns", "Union combines compatible relations", "Difference returns tuples present in one relation but not another", "Cartesian product pairs every tuple from two relations", "Join combines related tuples"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-3", "url": "https://www.youtube.com/results?search_query=relational+algebra+operations+DBMS+GATE+CSE", "title": "Relational Algebra Operations GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-4', 'dbms-chapter-3', 'Tuple Relational Calculus', 'Understand tuple relational calculus as a non-procedural formal query language.', 'Tuple relational calculus is a non-procedural query language in which queries specify what tuples should be retrieved rather than how to retrieve them.', 'A query can specify that we need tuples representing students enrolled in CSE without specifying the sequence of operations.', 'TRC uses tuple variables and logical predicates to describe the desired result.', '["TRC is non-procedural", "Uses tuple variables", "Uses predicates and logical conditions", "Specifies what data is required rather than how to obtain it"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-4", "url": "https://www.youtube.com/results?search_query=tuple+relational+calculus+DBMS+GATE+CSE", "title": "Tuple Relational Calculus DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-5', 'dbms-chapter-3', 'Integrity Constraints', 'Learn constraints that maintain correctness and consistency of data in relational databases.', 'Integrity constraints are rules imposed on database data to ensure that it remains valid and consistent.', 'A student RollNo may be required to be unique and non-null, while Branch may be restricted to valid values.', 'Important constraints include domain constraints, key constraints, entity integrity, and referential integrity.', '["Domain constraint restricts attribute values", "Key constraint ensures uniqueness", "Entity integrity requires primary key values to be non-null", "Referential integrity maintains valid foreign-key references"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-5", "url": "https://www.youtube.com/results?search_query=integrity+constraints+DBMS+GATE+CSE", "title": "Integrity Constraints DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-6', 'dbms-chapter-3', 'Functional Dependencies', 'Understand functional dependencies and their role in database design and normalization.', 'A functional dependency X → Y means that the value of attribute set X uniquely determines the value of attribute set Y.', 'If RollNo uniquely identifies a student, then RollNo → StudentName.', 'Functional dependencies describe relationships between attributes and are heavily used in normalization.', '["X → Y means X determines Y", "Left side is determinant", "Right side is dependent", "Functional dependencies are important for finding keys and normalization"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-6", "url": "https://www.youtube.com/results?search_query=functional+dependency+DBMS+GATE+CSE", "title": "Functional Dependency DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-7', 'dbms-chapter-3', 'SQL Basics', 'Learn the fundamentals of Structured Query Language and how SQL interacts with relational databases.', 'SQL is a declarative language used to define, manipulate, query, and control data in relational database systems.', 'A SQL query can retrieve all students from a Student table using SELECT.', 'SQL provides commands for querying and modifying data as well as defining database structures.', '["SQL is declarative", "SQL is used with relational databases", "SELECT retrieves data", "INSERT adds data", "UPDATE modifies data", "DELETE removes data"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-7", "url": "https://www.youtube.com/results?search_query=SQL+basics+DBMS+GATE+CSE", "title": "SQL Basics DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-8', 'dbms-chapter-3', 'SELECT, WHERE, ORDER BY', 'Learn how to retrieve, filter, and sort rows using fundamental SQL clauses.', 'SELECT retrieves data, WHERE filters rows according to conditions, and ORDER BY sorts the result.', 'A query can retrieve students from the CSE branch and sort them by their names.', 'These clauses form the foundation of most SQL retrieval queries.', '["SELECT chooses columns", "WHERE filters rows", "ORDER BY sorts results", "ASC is the default sort direction", "DESC sorts in descending order"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-8", "url": "https://www.youtube.com/results?search_query=SELECT+WHERE+ORDER+BY+SQL+DBMS+GATE+CSE", "title": "SELECT WHERE ORDER BY SQL DBMS GATE", "channel": "YouTube"}]'),
	('dbms-3-9', 'dbms-chapter-3', 'Aggregate Functions & GROUP BY', 'Learn COUNT, SUM, AVG, MIN, MAX, and grouping of rows using GROUP BY.', 'Aggregate functions perform calculations over multiple rows, while GROUP BY divides rows into groups for aggregation.', 'A college database can calculate the average marks of students in each branch using AVG and GROUP BY.', 'Common aggregate functions include COUNT, SUM, AVG, MIN, and MAX.', '["COUNT counts rows or values", "SUM calculates total", "AVG calculates average", "MIN and MAX find extreme values", "GROUP BY creates groups for aggregation", "HAVING filters groups"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-9", "url": "https://www.youtube.com/results?search_query=aggregate+functions+GROUP+BY+SQL+DBMS+GATE+CSE", "title": "Aggregate Functions GROUP BY SQL GATE", "channel": "YouTube"}]'),
	('dbms-3-10', 'dbms-chapter-3', 'Joins', 'Understand different SQL joins used to combine rows from multiple relations.', 'A join combines rows from two or more tables based on a related condition.', 'Student and Department tables can be joined using DepartmentID to display each student with their department name.', 'Important joins include inner join, left outer join, right outer join, full outer join, and natural join.', '["Inner join returns matching rows", "Left join preserves all rows from the left table", "Right join preserves all rows from the right table", "Full outer join preserves rows from both sides", "Natural join matches common attributes"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-10", "url": "https://www.youtube.com/results?search_query=SQL+joins+DBMS+GATE+CSE", "title": "SQL Joins DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-11', 'dbms-chapter-3', 'Nested Queries & Subqueries', 'Learn how SQL queries can be nested inside other queries.', 'A subquery is a query embedded within another SQL query and can be used to produce values or relations for the outer query.', 'A query can find students whose marks are greater than the average marks using a subquery.', 'Subqueries may appear in WHERE, FROM, HAVING, or other SQL clauses depending on the query.', '["Subquery is nested inside another query", "Can be scalar or return multiple rows", "IN, EXISTS, ANY, and ALL can be used with subqueries", "Correlated subqueries depend on the outer query"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-11", "url": "https://www.youtube.com/results?search_query=nested+queries+subqueries+SQL+DBMS+GATE+CSE", "title": "Nested Queries Subqueries SQL GATE", "channel": "YouTube"}]'),
	('dbms-3-12', 'dbms-chapter-3', 'Views', 'Understand database views and how virtual tables can be created from SQL queries.', 'A view is a virtual relation defined by a query over one or more base tables.', 'A college can create a view showing only student names and departments without exposing other columns.', 'Views can simplify complex queries, provide abstraction, and restrict access to selected data.', '["View is a virtual relation", "Created using CREATE VIEW", "Usually stores the query definition rather than duplicate data", "Views can provide abstraction and security"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-12", "url": "https://www.youtube.com/results?search_query=views+in+DBMS+SQL+GATE+CSE", "title": "Views in DBMS SQL GATE CSE", "channel": "YouTube"}]'),
	('dbms-3-13', 'dbms-chapter-3', 'SQL Constraints', 'Learn SQL constraints such as PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, and DEFAULT.', 'SQL constraints are rules defined on table columns to maintain data validity and integrity.', 'A Student table can define RollNo as PRIMARY KEY, Email as UNIQUE, and Age with a CHECK constraint.', 'Constraints can be declared while creating or modifying tables.', '["PRIMARY KEY uniquely identifies rows", "FOREIGN KEY maintains referential integrity", "UNIQUE prevents duplicate values", "NOT NULL prevents null values", "CHECK validates a condition", "DEFAULT supplies a default value"]', '2026-09-04 10:32:00.660441+00', '[{"id": "yt-dbms-3-13", "url": "https://www.youtube.com/results?search_query=SQL+constraints+DBMS+GATE+CSE", "title": "SQL Constraints DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-1', 'dbms-chapter-4', 'Functional Dependency', 'Learn the fundamentals of functional dependencies and how they describe relationships between attributes.', 'A functional dependency X → Y means that the value of attribute set X uniquely determines the value of attribute set Y.', 'If every RollNo corresponds to exactly one StudentName, then RollNo → StudentName.', 'Functional dependencies are essential for finding keys and analyzing redundancy during normalization.', '["X → Y means X determines Y", "X is the determinant", "Y is functionally dependent on X", "FDs are used extensively in normalization"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-1", "url": "https://www.youtube.com/results?search_query=functional+dependency+DBMS+GATE+CSE", "title": "Functional Dependency DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-2', 'dbms-chapter-4', 'Attribute Closure', 'Learn how to compute the closure of an attribute set using a given set of functional dependencies.', 'The closure of an attribute set X, written X+, is the set of all attributes that can be functionally determined by X.', 'Given FDs A → B and B → C, the closure A+ contains A, B, and C.', 'Attribute closure is commonly used to test whether an attribute set is a super key and to find candidate keys.', '["X+ contains all attributes functionally determined by X", "Start closure with X itself", "Repeatedly apply applicable FDs", "If X+ contains all attributes then X is a super key"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-2", "url": "https://www.youtube.com/results?search_query=attribute+closure+DBMS+GATE+CSE", "title": "Attribute Closure DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-3', 'dbms-chapter-4', 'Candidate Keys', 'Learn how candidate keys are identified using functional dependencies and attribute closure.', 'A candidate key is a minimal set of attributes that uniquely determines all attributes of a relation.', 'If AB+ contains every attribute in a relation and neither A nor B alone can determine all attributes, AB is a candidate key.', 'Candidate keys are minimal super keys and one candidate key is selected as the primary key.', '["Candidate key is a minimal super key", "Every candidate key uniquely identifies tuples", "A relation can have multiple candidate keys", "One candidate key is selected as primary key"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-3", "url": "https://www.youtube.com/results?search_query=candidate+keys+DBMS+GATE+CSE", "title": "Candidate Keys DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-4', 'dbms-chapter-4', 'Armstrong''s Axioms', 'Learn the inference rules used to derive functional dependencies from a given set of dependencies.', 'Armstrong''s axioms are a set of sound and complete inference rules for deriving functional dependencies.', 'From A → B and B → C, transitivity allows us to infer A → C.', 'The three fundamental axioms are reflexivity, augmentation, and transitivity. Union, decomposition, and pseudotransitivity can be derived from them.', '["Reflexivity: if Y ⊆ X then X → Y", "Augmentation: if X → Y then XZ → YZ", "Transitivity: if X → Y and Y → Z then X → Z", "Armstrong axioms are sound and complete"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-4", "url": "https://www.youtube.com/results?search_query=Armstrong+axioms+DBMS+GATE+CSE", "title": "Armstrong Axioms DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-5', 'dbms-chapter-4', 'Minimal / Canonical Cover', 'Learn how to find a minimal or canonical cover of a set of functional dependencies.', 'A minimal cover is an equivalent set of functional dependencies with a minimal number of dependencies and no extraneous attributes.', 'For a dependency AB → C, if A alone is sufficient to determine C under the remaining dependencies, B may be extraneous.', 'Minimal cover is useful during normalization and dependency-preserving decomposition.', '["Right sides are usually split into single attributes", "Remove extraneous attributes", "Remove redundant functional dependencies", "Minimal cover should preserve the original FD set"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-5", "url": "https://www.youtube.com/results?search_query=minimal+cover+canonical+cover+DBMS+GATE+CSE", "title": "Minimal Canonical Cover DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-6', 'dbms-chapter-4', 'First Normal Form (1NF)', 'Learn the first normal form and how atomicity affects relational table design.', 'A relation is in 1NF when every attribute contains atomic values and there are no repeating groups or multi-valued attributes in a single field.', 'Instead of storing multiple phone numbers in one cell, separate atomic values or a related relation can be used.', '1NF establishes atomic attribute values and is the starting point for higher normal forms.', '["Values should be atomic", "No repeating groups", "Each cell contains a single value", "1NF is the basic requirement for higher normal forms"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-6", "url": "https://www.youtube.com/results?search_query=1NF+first+normal+form+DBMS+GATE+CSE", "title": "1NF First Normal Form DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-7', 'dbms-chapter-4', 'Second Normal Form (2NF)', 'Learn partial functional dependency and the conditions required for a relation to be in 2NF.', 'A relation is in 2NF when it is in 1NF and no non-prime attribute is partially dependent on a candidate key.', 'If a composite key is StudentID + CourseID and CourseName depends only on CourseID, the relation violates 2NF.', '2NF mainly addresses partial dependency on composite candidate keys.', '["Relation must first be in 1NF", "No partial dependency of non-prime attributes", "Partial dependency matters when candidate key is composite", "2NF removes partial dependency"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-7", "url": "https://www.youtube.com/results?search_query=2NF+second+normal+form+DBMS+GATE+CSE", "title": "2NF Second Normal Form DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-8', 'dbms-chapter-4', 'Third Normal Form (3NF)', 'Learn transitive dependency and the conditions required for a relation to satisfy 3NF.', 'A relation is in 3NF if for every non-trivial functional dependency X → A, X is a super key or A is a prime attribute.', 'If StudentID determines DeptID and DeptID determines DeptName, then DeptName may be transitively dependent on StudentID.', '3NF removes problematic transitive dependencies while allowing some dependencies that BCNF would reject.', '["Relation must be in 2NF", "For every X → A, X must be a super key or A must be prime", "3NF handles transitive dependency", "3NF is less restrictive than BCNF"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-8", "url": "https://www.youtube.com/results?search_query=3NF+third+normal+form+DBMS+GATE+CSE", "title": "3NF Third Normal Form DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-9', 'dbms-chapter-4', 'BCNF', 'Learn Boyce-Codd Normal Form and how it is stricter than 3NF.', 'A relation is in BCNF if for every non-trivial functional dependency X → Y, X is a super key.', 'A relation may satisfy 3NF because the dependent attribute is prime but still violate BCNF when the determinant is not a super key.', 'BCNF removes certain redundancy that can remain in 3NF.', '["For every non-trivial FD X → Y, X must be a super key", "BCNF is stricter than 3NF", "Every BCNF relation is in 3NF", "Not every 3NF relation is in BCNF"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-9", "url": "https://www.youtube.com/results?search_query=BCNF+DBMS+GATE+CSE", "title": "BCNF DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-10', 'dbms-chapter-4', 'Lossless Decomposition', 'Learn how to decompose relations without losing information.', 'A decomposition is lossless if joining the decomposed relations reconstructs exactly the original relation without generating spurious tuples.', 'A relation containing student and department information can be split into Student and Department relations and later joined without introducing incorrect combinations.', 'Lossless decomposition is an important requirement when splitting relations during normalization.', '["Lossless decomposition preserves information", "Natural join should recover the original relation", "Lossless decomposition avoids spurious tuples", "Lossless join is important during normalization"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-10", "url": "https://www.youtube.com/results?search_query=lossless+decomposition+DBMS+GATE+CSE", "title": "Lossless Decomposition DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-4-11', 'dbms-chapter-4', 'Dependency Preservation', 'Learn how functional dependencies can be preserved after decomposition.', 'A decomposition is dependency preserving if all original functional dependencies can be enforced by checking the decomposed relations without requiring a join.', 'If A → B and B → C are represented in separate decomposed relations, the dependencies should still be enforceable using those relations.', 'Dependency preservation is desirable because it allows integrity constraints to be checked efficiently.', '["Dependencies should remain enforceable after decomposition", "No join should be required to verify preserved dependencies", "Dependency preservation is desirable but not always achievable with BCNF", "3NF decomposition can guarantee dependency preservation"]', '2026-09-04 10:34:44.103292+00', '[{"id": "yt-dbms-4-11", "url": "https://www.youtube.com/results?search_query=dependency+preservation+DBMS+GATE+CSE", "title": "Dependency Preservation DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-1', 'dbms-chapter-5', 'File Organization', 'Learn how records are physically organized and stored in database files.', 'File organization is the method used to arrange records on secondary storage so that insertion, deletion, and retrieval can be performed efficiently.', 'A student database may organize records sequentially by RollNo or use another organization depending on the type of queries performed.', 'The choice of file organization affects search performance, insertion cost, deletion cost, and storage utilization.', '["File organization determines physical arrangement of records", "Different organizations suit different workloads", "Access pattern is important when choosing file organization", "Storage organization affects database performance"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-1", "url": "https://www.youtube.com/results?search_query=file+organization+DBMS+GATE+CSE", "title": "File Organization DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-2', 'dbms-chapter-5', 'Sequential Files', 'Understand sequential file organization and its advantages and limitations.', 'In sequential file organization, records are stored one after another, often according to the value of a search key.', 'Employee records can be stored in increasing order of EmployeeID, making sequential processing efficient.', 'Sequential organization is useful for batch processing and ordered access but can be inefficient for frequent random searches and insertions.', '["Records are stored sequentially", "Ordered sequential files can support efficient sequential processing", "Random access can be slower", "Insertion may require additional work when order must be maintained"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-2", "url": "https://www.youtube.com/results?search_query=sequential+file+organization+DBMS+GATE+CSE", "title": "Sequential File Organization DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-3', 'dbms-chapter-5', 'Hashing', 'Learn hashing-based file organization and how hash functions locate records.', 'Hashing uses a hash function to map a search-key value to a storage location or bucket.', 'A student record with RollNo 125 can be mapped to a bucket using a hash function, allowing fast average direct access.', 'Hashing is effective for equality searches but is generally not suitable for efficient ordered or range queries.', '["Hash function maps keys to buckets", "Equality search is efficient on average", "Collisions occur when multiple keys map to the same bucket", "Hashing is generally poor for range queries"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-3", "url": "https://www.youtube.com/results?search_query=hashing+in+DBMS+GATE+CSE", "title": "Hashing in DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-4', 'dbms-chapter-5', 'Primary & Secondary Index', 'Understand primary and secondary indexes and how they improve record retrieval.', 'An index is an auxiliary data structure that provides a faster path to records based on search-key values.', 'An index on StudentID can help locate a student record without scanning the entire Student table.', 'A primary index is associated with an ordered data file whose ordering field is the primary key. A secondary index provides an additional access path.', '["Index speeds up data retrieval", "Primary index is associated with an ordered data file", "Secondary index provides an additional access path", "Indexes require extra storage and maintenance"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-4", "url": "https://www.youtube.com/results?search_query=primary+secondary+index+DBMS+GATE+CSE", "title": "Primary Secondary Index DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-5', 'dbms-chapter-5', 'Dense & Sparse Index', 'Learn the difference between dense and sparse indexing and when each is used.', 'A dense index has an index entry for every search-key value or record, while a sparse index contains entries for only some search-key values.', 'A sparse index on an ordered file may contain one entry per data block, while a dense index can contain an entry for every record.', 'Dense indexes generally provide faster direct lookup but require more storage. Sparse indexes use less space but depend on ordered data.', '["Dense index has more index entries", "Sparse index has fewer entries", "Sparse indexing generally requires ordered data", "Dense index uses more storage"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-5", "url": "https://www.youtube.com/results?search_query=dense+sparse+index+DBMS+GATE+CSE", "title": "Dense Sparse Index DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-6', 'dbms-chapter-5', 'Multilevel Index', 'Understand how multiple levels of indexing reduce the cost of searching a large index.', 'A multilevel index creates an index over another index so that the number of disk accesses required for searching can be reduced.', 'If a first-level index is too large to search efficiently, a higher-level index can point to blocks of the first-level index.', 'Multilevel indexing is based on the same principle as hierarchical searching and is an important foundation for tree-based indexes.', '["Index can be built over another index", "Reduces index search cost", "Higher levels contain fewer entries", "Useful when a single-level index becomes large"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-6", "url": "https://www.youtube.com/results?search_query=multilevel+index+DBMS+GATE+CSE", "title": "Multilevel Index DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-7', 'dbms-chapter-5', 'B-Tree', 'Learn the structure, properties, searching, insertion, and deletion operations of B-Trees.', 'A B-Tree is a balanced multiway search tree designed to keep search, insertion, and deletion efficient for large datasets.', 'A database can use a B-Tree index to locate records efficiently even when the index contains a large number of keys.', 'B-Trees keep keys and pointers in multiple nodes and maintain balance as records are inserted or deleted.', '["B-Tree is height-balanced", "Nodes can contain multiple keys", "Search, insertion, and deletion are logarithmic in tree height", "B-Trees are designed for secondary storage"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-7", "url": "https://www.youtube.com/results?search_query=B+Tree+DBMS+GATE+CSE", "title": "B Tree DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-8', 'dbms-chapter-5', 'B+ Tree', 'Learn B+ Tree structure, properties, operations, and its use in database indexing.', 'A B+ Tree is a balanced multiway search tree in which actual data pointers are stored at the leaf level, while internal nodes primarily guide searches.', 'A database can use a B+ Tree index on an employee salary column to support both equality and range searches efficiently.', 'B+ Trees are widely used for database indexes because leaf nodes can be linked, making sequential and range access efficient.', '["All search keys appear at leaf level", "Internal nodes primarily guide searches", "Leaf nodes are commonly linked", "Supports efficient range queries", "Tree remains balanced"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-8", "url": "https://www.youtube.com/results?search_query=B%2B+Tree+DBMS+GATE+CSE", "title": "B+ Tree DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-9', 'dbms-chapter-5', 'B-Tree vs B+ Tree', 'Compare B-Trees and B+ Trees based on structure, storage of records, search, and range queries.', 'B-Tree and B+ Tree are balanced multiway search trees, but they differ mainly in where record pointers or data entries are stored.', 'For database range queries, a B+ Tree can efficiently move through linked leaf nodes after locating the first matching key.', 'Understanding the structural differences between B-Tree and B+ Tree is important for GATE questions involving indexing.', '["B+ Tree stores data pointers at leaf level", "B+ Tree leaves are linked", "B+ Tree is particularly efficient for range queries", "B-Tree may store data pointers in internal nodes as well", "Both maintain balanced tree structure"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-9", "url": "https://www.youtube.com/results?search_query=B+Tree+vs+B%2B+Tree+DBMS+GATE+CSE", "title": "B Tree vs B+ Tree DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-5-10', 'dbms-chapter-5', 'Indexing Problems', 'Practice and understand common GATE problems involving indexes, blocks, fan-out, height, and disk accesses.', 'Indexing problems analyze the storage and access behavior of index structures using parameters such as block size, key size, pointer size, fan-out, and tree height.', 'A GATE question may ask for the number of disk accesses needed to search a B+ Tree with a given number of keys and block capacity.', 'Typical problems involve calculating index entries per block, fan-out, number of leaf blocks, tree height, and search cost.', '["Calculate entries per block carefully", "Fan-out depends on key and pointer sizes", "Tree height determines disk access cost", "B+ Tree range queries use leaf-level links", "Always distinguish key size from pointer size"]', '2026-09-04 10:37:49.46008+00', '[{"id": "yt-dbms-5-10", "url": "https://www.youtube.com/results?search_query=indexing+problems+DBMS+GATE+CSE", "title": "Indexing Problems DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-1', 'dbms-chapter-6', 'Transaction Concepts', 'Learn what a database transaction is and understand its basic properties and operations.', 'A transaction is a sequence of database operations that forms a logical unit of work and moves the database from one consistent state to another.', 'Transferring money from one bank account to another involves debiting one account and crediting another as part of a single transaction.', 'A transaction may contain read and write operations and should complete successfully or be rolled back according to the system rules.', '["Transaction is a logical unit of work", "Contains read and write operations", "A transaction should preserve database consistency", "COMMIT makes changes permanent", "ROLLBACK undoes uncommitted changes"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-1", "url": "https://www.youtube.com/results?search_query=transaction+concepts+DBMS+GATE+CSE", "title": "Transaction Concepts DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-2', 'dbms-chapter-6', 'Transaction States', 'Understand the different states through which a transaction passes during execution.', 'Transaction states describe the stages of a transaction from its initial execution to successful completion or failure.', 'A bank transfer may be active while processing, partially committed after the final operation, and committed once the system safely records the result.', 'Common states include active, partially committed, committed, failed, and aborted.', '["Active = transaction is executing", "Partially committed = final statement has executed", "Committed = transaction completed successfully", "Failed = transaction cannot proceed", "Aborted = transaction has been rolled back"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-2", "url": "https://www.youtube.com/results?search_query=transaction+states+DBMS+GATE+CSE", "title": "Transaction States DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-3', 'dbms-chapter-6', 'ACID Properties', 'Learn atomicity, consistency, isolation, and durability and why they are important for reliable transactions.', 'ACID is a set of properties that ensures database transactions are processed reliably.', 'In an online payment, either the complete payment operation occurs or none of it does, and committed changes survive system failures.', 'Atomicity, consistency, isolation, and durability together provide reliable transaction processing.', '["Atomicity = all or nothing", "Consistency = preserves integrity constraints", "Isolation = concurrent transactions behave appropriately", "Durability = committed changes survive failures"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-3", "url": "https://www.youtube.com/results?search_query=ACID+properties+DBMS+GATE+CSE", "title": "ACID Properties DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-4', 'dbms-chapter-6', 'Schedules', 'Learn how operations from multiple transactions are arranged into schedules.', 'A schedule is an ordering of operations from one or more transactions while preserving the relative order of operations within each transaction.', 'Two transactions updating different bank accounts may have their read and write operations interleaved in a concurrent schedule.', 'Schedules are used to analyze whether concurrent transaction execution is correct and equivalent to a safe serial execution.', '["Schedule contains operations of transactions", "Order within each transaction is preserved", "Serial schedule executes transactions one after another", "Non-serial schedule may interleave operations"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-4", "url": "https://www.youtube.com/results?search_query=schedules+DBMS+GATE+CSE", "title": "Schedules in DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-5', 'dbms-chapter-6', 'Serial & Non-Serial Schedules', 'Understand the difference between serial and non-serial schedules and their effect on concurrency.', 'A serial schedule executes transactions without interleaving, while a non-serial schedule interleaves operations of multiple transactions.', 'If Transaction T1 completes before T2 starts, the schedule is serial. If their operations are interleaved, it is non-serial.', 'Serial schedules are simple and inherently avoid many concurrency anomalies, while non-serial schedules can improve resource utilization.', '["Serial schedule has no interleaving", "Non-serial schedule allows interleaving", "Serial schedules are easy to reason about", "Non-serial execution can provide better concurrency"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-5", "url": "https://www.youtube.com/results?search_query=serial+non+serial+schedules+DBMS+GATE+CSE", "title": "Serial Non Serial Schedules DBMS GATE", "channel": "YouTube"}]'),
	('dbms-6-6', 'dbms-chapter-6', 'Conflict Serializability', 'Learn how to determine whether a schedule is conflict serializable using conflicting operations and precedence graphs.', 'A schedule is conflict serializable if it is conflict equivalent to some serial schedule.', 'A precedence graph can be constructed for a schedule; if the graph has no cycle, the schedule is conflict serializable.', 'Conflicting operations occur when they belong to different transactions, access the same data item, and at least one operation is a write.', '["Conflicting pairs include R-W, W-R, and W-W on the same item", "R-R is not a conflict", "Build precedence graph using conflicts", "Acyclic precedence graph implies conflict serializability", "Cycle implies not conflict serializable"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-6", "url": "https://www.youtube.com/results?search_query=conflict+serializability+DBMS+GATE+CSE", "title": "Conflict Serializability DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-7', 'dbms-chapter-6', 'View Serializability', 'Learn view equivalence and how view serializability differs from conflict serializability.', 'A schedule is view serializable if it is view equivalent to some serial schedule.', 'Two schedules may produce the same reads-from relationships and final writes even when their operations are not conflict equivalent.', 'View serializability is more general than conflict serializability, but checking it is computationally harder.', '["View serializability is broader than conflict serializability", "View equivalence considers initial reads, reads-from relationships, and final writes", "Every conflict-serializable schedule is view-serializable", "Some view-serializable schedules are not conflict-serializable"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-7", "url": "https://www.youtube.com/results?search_query=view+serializability+DBMS+GATE+CSE", "title": "View Serializability DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-8', 'dbms-chapter-6', 'Recoverability', 'Learn recoverable schedules and understand when transactions can safely commit.', 'A schedule is recoverable if a transaction that reads data written by another transaction commits only after the transaction that produced the data commits.', 'If T2 reads a value written by T1, T2 should not commit before T1 commits in a recoverable schedule.', 'Recoverability prevents a transaction from committing based on data produced by a transaction that later aborts.', '["If T2 reads from T1, T2 commits after T1", "Recoverable schedules prevent unsafe commits", "Recoverability is related to transaction failure handling", "Cascadeless schedules provide stronger restrictions"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-8", "url": "https://www.youtube.com/results?search_query=recoverability+DBMS+GATE+CSE", "title": "Recoverability in DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-9', 'dbms-chapter-6', 'Cascading & Cascadeless Schedules', 'Understand cascading rollback and how cascadeless schedules avoid reading uncommitted data.', 'A cascading rollback occurs when the failure of one transaction forces other transactions that read its uncommitted data to roll back.', 'If T2 reads an uncommitted value written by T1 and T1 aborts, T2 may also need to abort, causing a cascading rollback.', 'Cascadeless schedules prevent transactions from reading data written by uncommitted transactions.', '["Cascading rollback can affect multiple transactions", "Dirty reads can cause cascading rollback", "Cascadeless schedules avoid reading uncommitted data", "Every cascadeless schedule is recoverable"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-9", "url": "https://www.youtube.com/results?search_query=cascading+cascadeless+schedules+DBMS+GATE+CSE", "title": "Cascading Cascadeless Schedules DBMS GATE", "channel": "YouTube"}]'),
	('dbms-6-10', 'dbms-chapter-6', 'Lock-Based Protocols', 'Learn how locks control concurrent access to database items.', 'A lock-based protocol regulates access to data items by requiring transactions to obtain appropriate locks before reading or writing.', 'Two transactions accessing the same bank balance can use locks to prevent conflicting updates.', 'Shared locks are generally used for reading, while exclusive locks are generally used for writing.', '["Shared lock permits compatible reads", "Exclusive lock is required for writes", "Locks control concurrent access", "Lock compatibility determines whether another lock can be granted"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-10", "url": "https://www.youtube.com/results?search_query=lock+based+protocol+DBMS+GATE+CSE", "title": "Lock Based Protocol DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-11', 'dbms-chapter-6', 'Two-Phase Locking', 'Learn the growing and shrinking phases of two-phase locking and its role in conflict serializability.', 'Two-phase locking is a concurrency-control protocol in which a transaction has a growing phase for acquiring locks and a shrinking phase for releasing locks.', 'A transaction first obtains the locks it needs and later releases locks without acquiring new ones.', 'Basic 2PL guarantees conflict serializability, while variants such as strict 2PL provide stronger recovery properties.', '["Growing phase acquires locks", "Shrinking phase releases locks", "A transaction cannot acquire a new lock after releasing one", "Basic 2PL ensures conflict serializability", "Strict 2PL holds write locks until commit or abort"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-11", "url": "https://www.youtube.com/results?search_query=two+phase+locking+DBMS+GATE+CSE", "title": "Two Phase Locking DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-12', 'dbms-chapter-6', 'Deadlock in DBMS', 'Learn how deadlocks occur between transactions and the common methods used to handle them.', 'A deadlock occurs when transactions wait indefinitely for resources held by one another.', 'T1 holds a lock on item A and waits for B, while T2 holds B and waits for A.', 'Deadlocks can be detected using a wait-for graph or prevented using suitable protocols.', '["Deadlock involves circular waiting", "Wait-for graph can detect cycles", "Deadlock prevention avoids unsafe waiting conditions", "Deadlock detection identifies cycles and recovery can terminate transactions"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-12", "url": "https://www.youtube.com/results?search_query=deadlock+DBMS+GATE+CSE", "title": "Deadlock in DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-13', 'dbms-chapter-6', 'Timestamp Ordering', 'Learn timestamp-based concurrency control and how transactions are ordered using timestamps.', 'Timestamp ordering is a concurrency-control technique that assigns each transaction a unique timestamp and ensures conflicting operations follow that order.', 'If T1 has an earlier timestamp than T2, the system ensures conflicting operations respect the ordering determined by those timestamps.', 'Timestamp ordering uses read and write timestamps associated with data items to decide whether operations can proceed.', '["Each transaction receives a timestamp", "Older transactions have smaller timestamps", "Operations must respect timestamp order", "Invalid operations may cause transaction rollback"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-13", "url": "https://www.youtube.com/results?search_query=timestamp+ordering+DBMS+GATE+CSE", "title": "Timestamp Ordering DBMS GATE CSE", "channel": "YouTube"}]'),
	('dbms-6-14', 'dbms-chapter-6', 'Recovery Concepts', 'Learn database recovery concepts including logs, checkpoints, undo, redo, and crash recovery.', 'Database recovery is the process of restoring the database to a consistent state after failures.', 'After a system crash, the DBMS can use a log to redo committed changes and undo incomplete transactions.', 'Recovery techniques use logs and checkpoints to reduce recovery time and restore consistency after failures.', '["Log records changes needed for recovery", "UNDO reverses effects of incomplete transactions", "REDO reapplies required committed changes", "Checkpoint reduces recovery work", "Recovery handles transaction and system failures"]', '2026-09-04 10:40:08.356499+00', '[{"id": "yt-dbms-6-14", "url": "https://www.youtube.com/results?search_query=recovery+concepts+DBMS+GATE+CSE", "title": "Recovery Concepts DBMS GATE CSE", "channel": "YouTube"}]');


--


--
-- PostgreSQL database dump complete
--

-- \unrestrict PjoSqWK8Dr11GKDLkbSX23X2EAavU79UrDQ3ssCPFyn9lesvC8VBEufgMZp3zQ9

RESET ALL;
