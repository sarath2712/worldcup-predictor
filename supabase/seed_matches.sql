-- Sample matches for FIFA World Cup 2026 (Group Stage - first few days)
-- All times in UTC. Full schedule TBD by FIFA.

insert into public.matches (stage, home_team, away_team, kickoff_utc, venue) values
-- June 11 - Opening
('Group A', 'Mexico', 'TBD', '2026-06-11 18:00:00+00', 'Estadio Azteca, Mexico City'),
('Group A', 'USA', 'TBD', '2026-06-11 21:00:00+00', 'SoFi Stadium, Los Angeles'),

-- June 12
('Group B', 'Canada', 'TBD', '2026-06-12 16:00:00+00', 'BMO Field, Toronto'),
('Group B', 'TBD', 'TBD', '2026-06-12 19:00:00+00', 'MetLife Stadium, New Jersey'),
('Group C', 'TBD', 'TBD', '2026-06-12 22:00:00+00', 'AT&T Stadium, Dallas'),

-- June 13
('Group C', 'TBD', 'TBD', '2026-06-13 16:00:00+00', 'Hard Rock Stadium, Miami'),
('Group D', 'TBD', 'TBD', '2026-06-13 19:00:00+00', 'Lincoln Financial Field, Philadelphia'),
('Group D', 'TBD', 'TBD', '2026-06-13 22:00:00+00', 'Lumen Field, Seattle'),

-- June 14
('Group E', 'TBD', 'TBD', '2026-06-14 16:00:00+00', 'Gillette Stadium, Boston'),
('Group E', 'TBD', 'TBD', '2026-06-14 19:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Group F', 'TBD', 'TBD', '2026-06-14 22:00:00+00', 'NRG Stadium, Houston'),

-- June 15
('Group F', 'TBD', 'TBD', '2026-06-15 16:00:00+00', 'Arrowhead Stadium, Kansas City'),
('Group G', 'TBD', 'TBD', '2026-06-15 19:00:00+00', 'BC Place, Vancouver'),
('Group G', 'TBD', 'TBD', '2026-06-15 22:00:00+00', 'Guadalajara Stadium, Guadalajara'),

-- Knockout stage placeholders
('Round of 32', 'TBD', 'TBD', '2026-06-28 16:00:00+00', 'TBD'),
('Round of 32', 'TBD', 'TBD', '2026-06-28 20:00:00+00', 'TBD'),
('Quarter-final', 'TBD', 'TBD', '2026-07-04 18:00:00+00', 'TBD'),
('Quarter-final', 'TBD', 'TBD', '2026-07-05 18:00:00+00', 'TBD'),
('Semi-final', 'TBD', 'TBD', '2026-07-14 18:00:00+00', 'TBD'),
('Semi-final', 'TBD', 'TBD', '2026-07-15 18:00:00+00', 'TBD'),
('Final', 'TBD', 'TBD', '2026-07-19 18:00:00+00', 'MetLife Stadium, New Jersey');
