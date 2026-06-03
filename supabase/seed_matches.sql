-- FIFA World Cup 2026 - Complete Match Schedule (104 matches)
-- All times in UTC. Browser converts to user's local time (IST = UTC+5:30)
-- Source: Wikipedia / FIFA official schedule

-- Clear existing match data first
DELETE FROM public.predictions;
DELETE FROM public.matches;

-- ===================== GROUP STAGE (72 matches) =====================

-- GROUP A: Mexico, South Africa, South Korea, Czech Republic
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group A', 'Mexico', 'South Africa', '2026-06-11 19:00:00+00', 'Estadio Azteca, Mexico City'),
('Group A', 'South Korea', 'Czech Republic', '2026-06-12 02:00:00+00', 'Estadio Akron, Zapopan'),
('Group A', 'Czech Republic', 'South Africa', '2026-06-18 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Group A', 'Mexico', 'South Korea', '2026-06-19 01:00:00+00', 'Estadio Akron, Zapopan'),
('Group A', 'Czech Republic', 'Mexico', '2026-06-25 01:00:00+00', 'Estadio Azteca, Mexico City'),
('Group A', 'South Africa', 'South Korea', '2026-06-25 01:00:00+00', 'Estadio BBVA, Guadalupe');

-- GROUP B: Canada, Bosnia and Herzegovina, Qatar, Switzerland
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group B', 'Canada', 'Bosnia and Herzegovina', '2026-06-12 19:00:00+00', 'BMO Field, Toronto'),
('Group B', 'Qatar', 'Switzerland', '2026-06-13 19:00:00+00', 'Levis Stadium, Santa Clara'),
('Group B', 'Switzerland', 'Bosnia and Herzegovina', '2026-06-18 19:00:00+00', 'SoFi Stadium, Inglewood'),
('Group B', 'Canada', 'Qatar', '2026-06-18 22:00:00+00', 'BC Place, Vancouver'),
('Group B', 'Switzerland', 'Canada', '2026-06-24 19:00:00+00', 'BC Place, Vancouver'),
('Group B', 'Bosnia and Herzegovina', 'Qatar', '2026-06-24 19:00:00+00', 'Lumen Field, Seattle');

-- GROUP C: Brazil, Morocco, Haiti, Scotland
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group C', 'Brazil', 'Morocco', '2026-06-13 22:00:00+00', 'MetLife Stadium, East Rutherford'),
('Group C', 'Haiti', 'Scotland', '2026-06-14 01:00:00+00', 'Gillette Stadium, Foxborough'),
('Group C', 'Scotland', 'Morocco', '2026-06-19 22:00:00+00', 'Gillette Stadium, Foxborough'),
('Group C', 'Brazil', 'Haiti', '2026-06-20 00:30:00+00', 'Lincoln Financial Field, Philadelphia'),
('Group C', 'Scotland', 'Brazil', '2026-06-24 22:00:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Group C', 'Morocco', 'Haiti', '2026-06-24 22:00:00+00', 'Mercedes-Benz Stadium, Atlanta');

-- GROUP D: United States, Paraguay, Australia, Turkey
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group D', 'United States', 'Paraguay', '2026-06-13 01:00:00+00', 'SoFi Stadium, Inglewood'),
('Group D', 'Australia', 'Turkey', '2026-06-14 04:00:00+00', 'BC Place, Vancouver'),
('Group D', 'United States', 'Australia', '2026-06-19 19:00:00+00', 'Lumen Field, Seattle'),
('Group D', 'Turkey', 'Paraguay', '2026-06-20 03:00:00+00', 'Levis Stadium, Santa Clara'),
('Group D', 'Turkey', 'United States', '2026-06-26 02:00:00+00', 'SoFi Stadium, Inglewood'),
('Group D', 'Paraguay', 'Australia', '2026-06-26 02:00:00+00', 'Levis Stadium, Santa Clara');

-- GROUP E: Germany, Curaçao, Ivory Coast, Ecuador
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group E', 'Germany', 'Curaçao', '2026-06-14 17:00:00+00', 'NRG Stadium, Houston'),
('Group E', 'Ivory Coast', 'Ecuador', '2026-06-14 23:00:00+00', 'Lincoln Financial Field, Philadelphia'),
('Group E', 'Germany', 'Ivory Coast', '2026-06-20 20:00:00+00', 'BMO Field, Toronto'),
('Group E', 'Ecuador', 'Curaçao', '2026-06-21 00:00:00+00', 'Arrowhead Stadium, Kansas City'),
('Group E', 'Curaçao', 'Ivory Coast', '2026-06-25 20:00:00+00', 'Lincoln Financial Field, Philadelphia'),
('Group E', 'Ecuador', 'Germany', '2026-06-25 20:00:00+00', 'MetLife Stadium, East Rutherford');

-- GROUP F: Netherlands, Japan, Sweden, Tunisia
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group F', 'Netherlands', 'Japan', '2026-06-14 20:00:00+00', 'AT&T Stadium, Arlington'),
('Group F', 'Sweden', 'Tunisia', '2026-06-15 02:00:00+00', 'Estadio BBVA, Guadalupe'),
('Group F', 'Netherlands', 'Sweden', '2026-06-20 17:00:00+00', 'NRG Stadium, Houston'),
('Group F', 'Tunisia', 'Japan', '2026-06-21 04:00:00+00', 'Estadio BBVA, Guadalupe'),
('Group F', 'Japan', 'Sweden', '2026-06-25 23:00:00+00', 'AT&T Stadium, Arlington'),
('Group F', 'Tunisia', 'Netherlands', '2026-06-25 23:00:00+00', 'Arrowhead Stadium, Kansas City');

-- GROUP G: Belgium, Egypt, Iran, New Zealand
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group G', 'Belgium', 'Egypt', '2026-06-15 19:00:00+00', 'Lumen Field, Seattle'),
('Group G', 'Iran', 'New Zealand', '2026-06-16 01:00:00+00', 'SoFi Stadium, Inglewood'),
('Group G', 'Belgium', 'Iran', '2026-06-21 19:00:00+00', 'SoFi Stadium, Inglewood'),
('Group G', 'New Zealand', 'Egypt', '2026-06-22 01:00:00+00', 'BC Place, Vancouver'),
('Group G', 'Egypt', 'Iran', '2026-06-27 03:00:00+00', 'Lumen Field, Seattle'),
('Group G', 'New Zealand', 'Belgium', '2026-06-27 03:00:00+00', 'BC Place, Vancouver');

-- GROUP H: Spain, Cape Verde, Saudi Arabia, Uruguay
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group H', 'Spain', 'Cape Verde', '2026-06-15 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Group H', 'Saudi Arabia', 'Uruguay', '2026-06-15 22:00:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Group H', 'Spain', 'Saudi Arabia', '2026-06-21 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Group H', 'Uruguay', 'Cape Verde', '2026-06-21 22:00:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Group H', 'Cape Verde', 'Saudi Arabia', '2026-06-27 00:00:00+00', 'NRG Stadium, Houston'),
('Group H', 'Uruguay', 'Spain', '2026-06-27 00:00:00+00', 'Estadio Akron, Zapopan');

-- GROUP I: France, Senegal, Iraq, Norway
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group I', 'France', 'Senegal', '2026-06-16 19:00:00+00', 'MetLife Stadium, East Rutherford'),
('Group I', 'Iraq', 'Norway', '2026-06-16 22:00:00+00', 'Gillette Stadium, Foxborough'),
('Group I', 'France', 'Iraq', '2026-06-22 21:00:00+00', 'Lincoln Financial Field, Philadelphia'),
('Group I', 'Norway', 'Senegal', '2026-06-23 00:00:00+00', 'MetLife Stadium, East Rutherford'),
('Group I', 'Norway', 'France', '2026-06-26 19:00:00+00', 'Gillette Stadium, Foxborough'),
('Group I', 'Senegal', 'Iraq', '2026-06-26 19:00:00+00', 'BMO Field, Toronto');

-- GROUP J: Argentina, Algeria, Austria, Jordan
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group J', 'Argentina', 'Algeria', '2026-06-17 01:00:00+00', 'Arrowhead Stadium, Kansas City'),
('Group J', 'Austria', 'Jordan', '2026-06-17 04:00:00+00', 'Levis Stadium, Santa Clara'),
('Group J', 'Argentina', 'Austria', '2026-06-22 17:00:00+00', 'AT&T Stadium, Arlington'),
('Group J', 'Jordan', 'Algeria', '2026-06-23 03:00:00+00', 'Levis Stadium, Santa Clara'),
('Group J', 'Algeria', 'Austria', '2026-06-28 02:00:00+00', 'Arrowhead Stadium, Kansas City'),
('Group J', 'Jordan', 'Argentina', '2026-06-28 02:00:00+00', 'AT&T Stadium, Arlington');

-- GROUP K: Portugal, DR Congo, Uzbekistan, Colombia
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group K', 'Portugal', 'DR Congo', '2026-06-17 17:00:00+00', 'NRG Stadium, Houston'),
('Group K', 'Uzbekistan', 'Colombia', '2026-06-18 02:00:00+00', 'Estadio Azteca, Mexico City'),
('Group K', 'Portugal', 'Uzbekistan', '2026-06-23 17:00:00+00', 'NRG Stadium, Houston'),
('Group K', 'Colombia', 'DR Congo', '2026-06-24 02:00:00+00', 'Estadio Akron, Zapopan'),
('Group K', 'Colombia', 'Portugal', '2026-06-27 23:30:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Group K', 'DR Congo', 'Uzbekistan', '2026-06-27 23:30:00+00', 'Mercedes-Benz Stadium, Atlanta');

-- GROUP L: England, Croatia, Ghana, Panama
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Group L', 'England', 'Croatia', '2026-06-17 20:00:00+00', 'AT&T Stadium, Arlington'),
('Group L', 'Ghana', 'Panama', '2026-06-17 23:00:00+00', 'BMO Field, Toronto'),
('Group L', 'England', 'Ghana', '2026-06-23 20:00:00+00', 'Gillette Stadium, Foxborough'),
('Group L', 'Panama', 'Croatia', '2026-06-23 23:00:00+00', 'BMO Field, Toronto'),
('Group L', 'Panama', 'England', '2026-06-27 21:00:00+00', 'MetLife Stadium, East Rutherford'),
('Group L', 'Croatia', 'Ghana', '2026-06-27 21:00:00+00', 'Lincoln Financial Field, Philadelphia');

-- ===================== KNOCKOUT STAGE (32 matches) =====================

-- ROUND OF 32 (June 28 - July 3)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Round of 32', 'Runner-up Group A', 'Runner-up Group B', '2026-06-28 19:00:00+00', 'SoFi Stadium, Inglewood'),
('Round of 32', 'Winner Group C', 'Runner-up Group F', '2026-06-29 17:00:00+00', 'NRG Stadium, Houston'),
('Round of 32', 'Winner Group E', '3rd Place TBD', '2026-06-29 20:30:00+00', 'Gillette Stadium, Foxborough'),
('Round of 32', 'Winner Group F', 'Runner-up Group C', '2026-06-30 01:00:00+00', 'Estadio BBVA, Guadalupe'),
('Round of 32', 'Runner-up Group E', 'Runner-up Group I', '2026-06-30 17:00:00+00', 'AT&T Stadium, Arlington'),
('Round of 32', 'Winner Group I', '3rd Place TBD', '2026-06-30 21:00:00+00', 'MetLife Stadium, East Rutherford'),
('Round of 32', 'Winner Group A', '3rd Place TBD', '2026-07-01 01:00:00+00', 'Estadio Azteca, Mexico City'),
('Round of 32', 'Winner Group L', '3rd Place TBD', '2026-07-01 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Round of 32', 'Winner Group G', '3rd Place TBD', '2026-07-01 20:00:00+00', 'Lumen Field, Seattle'),
('Round of 32', 'Winner Group D', '3rd Place TBD', '2026-07-02 00:00:00+00', 'Levis Stadium, Santa Clara'),
('Round of 32', 'Winner Group H', 'Runner-up Group J', '2026-07-02 19:00:00+00', 'SoFi Stadium, Inglewood'),
('Round of 32', 'Runner-up Group K', 'Runner-up Group L', '2026-07-02 23:00:00+00', 'BMO Field, Toronto'),
('Round of 32', 'Winner Group B', '3rd Place TBD', '2026-07-03 03:00:00+00', 'BC Place, Vancouver'),
('Round of 32', 'Runner-up Group D', 'Runner-up Group G', '2026-07-03 18:00:00+00', 'AT&T Stadium, Arlington'),
('Round of 32', 'Winner Group J', 'Runner-up Group H', '2026-07-03 22:00:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Round of 32', 'Winner Group K', '3rd Place TBD', '2026-07-04 01:30:00+00', 'Arrowhead Stadium, Kansas City');

-- ROUND OF 16 (July 4-7)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Round of 16', 'TBD', 'TBD', '2026-07-04 17:00:00+00', 'NRG Stadium, Houston'),
('Round of 16', 'TBD', 'TBD', '2026-07-04 21:00:00+00', 'Lincoln Financial Field, Philadelphia'),
('Round of 16', 'TBD', 'TBD', '2026-07-05 20:00:00+00', 'MetLife Stadium, East Rutherford'),
('Round of 16', 'TBD', 'TBD', '2026-07-06 00:00:00+00', 'Estadio Azteca, Mexico City'),
('Round of 16', 'TBD', 'TBD', '2026-07-06 19:00:00+00', 'AT&T Stadium, Arlington'),
('Round of 16', 'TBD', 'TBD', '2026-07-07 00:00:00+00', 'Lumen Field, Seattle'),
('Round of 16', 'TBD', 'TBD', '2026-07-07 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta'),
('Round of 16', 'TBD', 'TBD', '2026-07-07 20:00:00+00', 'BC Place, Vancouver');

-- QUARTER-FINALS (July 9-11)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Quarter-final', 'TBD', 'TBD', '2026-07-09 20:00:00+00', 'Gillette Stadium, Foxborough'),
('Quarter-final', 'TBD', 'TBD', '2026-07-10 19:00:00+00', 'SoFi Stadium, Inglewood'),
('Quarter-final', 'TBD', 'TBD', '2026-07-11 21:00:00+00', 'Hard Rock Stadium, Miami Gardens'),
('Quarter-final', 'TBD', 'TBD', '2026-07-12 01:00:00+00', 'Arrowhead Stadium, Kansas City');

-- SEMI-FINALS (July 14-15)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Semi-final', 'TBD', 'TBD', '2026-07-14 19:00:00+00', 'AT&T Stadium, Arlington'),
('Semi-final', 'TBD', 'TBD', '2026-07-15 19:00:00+00', 'Mercedes-Benz Stadium, Atlanta');

-- THIRD PLACE MATCH (July 18)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Third Place', 'TBD', 'TBD', '2026-07-18 21:00:00+00', 'Hard Rock Stadium, Miami Gardens');

-- FINAL (July 19)
INSERT INTO public.matches (stage, home_team, away_team, kickoff_utc, venue) VALUES
('Final', 'TBD', 'TBD', '2026-07-19 19:00:00+00', 'MetLife Stadium, East Rutherford');
