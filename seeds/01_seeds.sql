INSERT INTO users (name, email, password)
VALUES ('Jonathan Cheng', 'email1@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Andrew Ghaly', 'email2@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Husam Ali', 'email3@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES (2, 'First property', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '1 Yonge Street', 'Toronto', 'Ontario', 'M5V 3S6'),
(3, 'Second property', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '2 Yonge Street', 'Toronto', 'Ontario', 'M5V 3S6'),
(2, 'Third property', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 'Canada', '3 Yonge Street', 'Toronto', 'Ontario', 'M5V 3S8');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2022-02-06', '2022-03-05', 1, 1),
('2021-12-02', '2022-04-23', 2, 1),
('2019-03-11', '2021-11-11', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 4, 5, 'cool place'),
(1, 2, 5, 4, 'cooler place'),
(3, 3, 6, 5, 'coolest place');
