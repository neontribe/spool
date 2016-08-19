INSERT INTO topic_type (type) VALUES ('transport'), ('shopping'), ('health'), ('entertainment'), ('sport'), ('public_transport');
INSERT INTO media_type (type) VALUES ('text'), ('video'), ('image');
INSERT INTO sentiment_type (type) VALUES ('happy'), ('sad');

insert into user_account (first_name, last_name, email) values ('Test', '1', 'test1@example.com');
insert into user_account (first_name, last_name, email) values ('Test', '2', 'test2@example.com');

insert into x_entry_topics (entry_id, topic_type_id) values (1, 1);
insert into x_entry_topics (entry_id, topic_type_id) values (2, 2);

insert into media (type_id, text) values (1, 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.');
insert into media (type_id, text) values (1, 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.

Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.');

insert into entry (media_id, owner_id, author_id, sentiment_type_id) values (1, 2, 2, 1);
insert into entry (media_id, owner_id, author_id, sentiment_type_id) values (2, 2, 1, 2);
