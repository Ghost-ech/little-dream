-- Little Dream Association - Seed Data
-- database/schema.sql
\c little_dream;

-- Admin user (password: Admin@2025 - bcrypt hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin Little Dream', 'admin@littledream.cm', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Activities
INSERT INTO activities (title, description, category, image_url, status) VALUES
('Soutien scolaire', 'Programme de tutorat pour les enfants défavorisés de Douala. Nous offrons des cours de mathématiques, français et sciences chaque samedi.', 'Education', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600', 'active'),
('Danses traditionnelles', 'Initiation aux danses camerounaises : Bikutsi, Makossa, Bamiléké. Préservation du patrimoine culturel pour les jeunes générations.', 'Culture', 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=600', 'active'),
('Atelier cuisine locale', 'Apprentissage des recettes traditionnelles camerounaises : Ndolé, Eru, Koki, Mbongo Tchobi. Valorisation de la gastronomie camerounaise.', 'Culture', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'active'),
('Sport & Santé', 'Tournois de football, basketball et course à pied pour promouvoir la santé des jeunes dans nos quartiers.', 'Sport', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600', 'active'),
('Alphabétisation adultes', 'Cours d''alphabétisation pour adultes les soirs de semaine. Lire, écrire et compter pour mieux s''intégrer.', 'Education', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600', 'active'),
('Contes & Traditions', 'Soirées de contes camerounais animées par des conteurs traditionnels. Transmission orale du patrimoine culturel.', 'Culture', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600', 'active');

-- Events
INSERT INTO events (title, description, location, event_date, image_url, is_published) VALUES
('Journée Culturelle Camerounaise 2025', 'Grande journée de célébration de la culture camerounaise avec danses, chants, expositions artisanales et dégustation culinaire. Entrée libre pour tous.', 'Esplanade du Palais des Congrès, Yaoundé', '2025-05-20 09:00:00', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600', true),
('Tournoi de Football Little Dream', 'Tournoi inter-quartiers de football. 16 équipes en compétition. Remise de prix aux 3 premières équipes.', 'Terrain omnisports de Bepanda, Douala', '2025-04-15 14:00:00', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600', true),
('Collecte de fournitures scolaires', 'Collecte de fournitures et matériel scolaire pour les enfants défavorisés. Venez déposer vos dons !', 'Siège de Little Dream, Douala', '2025-04-01 08:00:00', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', true),
('Atelier Ndolé & Eru', 'Atelier de cuisine traditionnelle camerounaise animé par la cheffe Mama Ngono. Places limitées — inscription obligatoire.', 'Centre Communautaire de Bonabéri, Douala', '2025-05-03 10:00:00', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', true);

-- Stats
INSERT INTO stats (label, value, icon) VALUES
('Enfants aidés', 240, 'children'),
('Bénévoles actifs', 45, 'volunteers'),
('Activités réalisées', 38, 'activities'),
('Dons collectés (FCFA)', 1250000, 'donations');

-- Gallery
INSERT INTO gallery (title, image_url, category) VALUES
('Cours de soutien scolaire', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400', 'Education'),
('Danse Bikutsi', 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=400', 'Culture'),
('Tournoi de football', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', 'Sport'),
('Cuisine traditionnelle', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'Culture'),
('Remise de prix', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', 'Events'),
('Soirée contes', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', 'Culture');
