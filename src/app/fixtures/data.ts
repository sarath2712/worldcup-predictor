export type Match = {
  time: string;
  team1: string;
  team2: string;
  group: string;
  venue: string;
};

export const fixturesByDay: Record<string, Match[]> = {
  "Jun 11 (Wed)": [
    { time: "19:00", team1: "Mexico", team2: "South Africa", group: "A", venue: "Mexico City" },
    { time: "02:00", team1: "South Korea", team2: "Czech Republic", group: "A", venue: "Guadalajara" },
  ],
  "Jun 12 (Thu)": [
    { time: "15:00", team1: "Canada", team2: "Bosnia & Herzegovina", group: "B", venue: "Toronto" },
    { time: "01:00", team1: "United States", team2: "Paraguay", group: "D", venue: "Los Angeles" },
  ],
  "Jun 13 (Fri)": [
    { time: "12:00", team1: "Qatar", team2: "Switzerland", group: "B", venue: "San Francisco" },
    { time: "17:00", team1: "Haiti", team2: "Scotland", group: "C", venue: "Boston" },
    { time: "22:00", team1: "Brazil", team2: "Morocco", group: "C", venue: "New York/NJ" },
    { time: "04:00", team1: "Australia", team2: "Turkey", group: "D", venue: "Vancouver" },
  ],
  "Jun 14 (Sat)": [
    { time: "12:00", team1: "Germany", team2: "Curaçao", group: "E", venue: "Houston" },
    { time: "19:00", team1: "Ivory Coast", team2: "Ecuador", group: "E", venue: "Philadelphia" },
    { time: "15:00", team1: "Netherlands", team2: "Japan", group: "F", venue: "Dallas" },
    { time: "20:00", team1: "Sweden", team2: "Tunisia", group: "F", venue: "Monterrey" },
  ],
  "Jun 15 (Sun)": [
    { time: "12:00", team1: "Belgium", team2: "Egypt", group: "G", venue: "Seattle" },
    { time: "18:00", team1: "Iran", team2: "New Zealand", group: "G", venue: "Los Angeles" },
    { time: "12:00", team1: "Spain", team2: "Cape Verde", group: "H", venue: "Atlanta" },
    { time: "18:00", team1: "Saudi Arabia", team2: "Uruguay", group: "H", venue: "Miami" },
  ],
  "Jun 16 (Mon)": [
    { time: "15:00", team1: "France", team2: "Senegal", group: "I", venue: "New York/NJ" },
    { time: "18:00", team1: "Iraq", team2: "Norway", group: "I", venue: "Boston" },
    { time: "20:00", team1: "Argentina", team2: "Algeria", group: "J", venue: "Kansas City" },
    { time: "21:00", team1: "Austria", team2: "Jordan", group: "J", venue: "San Francisco" },
  ],
  "Jun 17 (Tue)": [
    { time: "12:00", team1: "Portugal", team2: "DR Congo", group: "K", venue: "Houston" },
    { time: "20:00", team1: "Uzbekistan", team2: "Colombia", group: "K", venue: "Mexico City" },
    { time: "15:00", team1: "England", team2: "Croatia", group: "L", venue: "Dallas" },
    { time: "19:00", team1: "Ghana", team2: "Panama", group: "L", venue: "Toronto" },
  ],
  "Jun 18 (Wed)": [
    { time: "12:00", team1: "Czech Republic", team2: "South Africa", group: "A", venue: "Atlanta" },
    { time: "19:00", team1: "Mexico", team2: "South Korea", group: "A", venue: "Guadalajara" },
    { time: "12:00", team1: "Switzerland", team2: "Bosnia & Herzegovina", group: "B", venue: "Los Angeles" },
    { time: "15:00", team1: "Canada", team2: "Qatar", group: "B", venue: "Vancouver" },
  ],
  "Jun 19 (Thu)": [
    { time: "18:00", team1: "Scotland", team2: "Morocco", group: "C", venue: "Boston" },
    { time: "20:30", team1: "Brazil", team2: "Haiti", group: "C", venue: "Philadelphia" },
    { time: "12:00", team1: "United States", team2: "Australia", group: "D", venue: "Seattle" },
    { time: "20:00", team1: "Turkey", team2: "Paraguay", group: "D", venue: "San Francisco" },
  ],
  "Jun 20 (Fri)": [
    { time: "16:00", team1: "Germany", team2: "Ivory Coast", group: "E", venue: "Toronto" },
    { time: "19:00", team1: "Ecuador", team2: "Curaçao", group: "E", venue: "Kansas City" },
    { time: "12:00", team1: "Netherlands", team2: "Sweden", group: "F", venue: "Houston" },
    { time: "22:00", team1: "Tunisia", team2: "Japan", group: "F", venue: "Monterrey" },
  ],
  "Jun 21 (Sat)": [
    { time: "12:00", team1: "Belgium", team2: "Iran", group: "G", venue: "Los Angeles" },
    { time: "18:00", team1: "New Zealand", team2: "Egypt", group: "G", venue: "Vancouver" },
    { time: "12:00", team1: "Spain", team2: "Saudi Arabia", group: "H", venue: "Atlanta" },
    { time: "18:00", team1: "Uruguay", team2: "Cape Verde", group: "H", venue: "Miami" },
  ],
  "Jun 22 (Sun)": [
    { time: "17:00", team1: "France", team2: "Iraq", group: "I", venue: "Philadelphia" },
    { time: "20:00", team1: "Norway", team2: "Senegal", group: "I", venue: "New York/NJ" },
    { time: "12:00", team1: "Argentina", team2: "Austria", group: "J", venue: "Dallas" },
    { time: "20:00", team1: "Jordan", team2: "Algeria", group: "J", venue: "San Francisco" },
  ],
  "Jun 23 (Mon)": [
    { time: "12:00", team1: "Portugal", team2: "Uzbekistan", group: "K", venue: "Houston" },
    { time: "20:00", team1: "Colombia", team2: "DR Congo", group: "K", venue: "Guadalajara" },
    { time: "16:00", team1: "England", team2: "Ghana", group: "L", venue: "Boston" },
    { time: "19:00", team1: "Panama", team2: "Croatia", group: "L", venue: "Toronto" },
  ],
  "Jun 24 (Tue)": [
    { time: "19:00", team1: "Czech Republic", team2: "Mexico", group: "A", venue: "Mexico City" },
    { time: "19:00", team1: "South Africa", team2: "South Korea", group: "A", venue: "Monterrey" },
    { time: "12:00", team1: "Switzerland", team2: "Canada", group: "B", venue: "Vancouver" },
    { time: "12:00", team1: "Bosnia & Herzegovina", team2: "Qatar", group: "B", venue: "Seattle" },
    { time: "18:00", team1: "Scotland", team2: "Brazil", group: "C", venue: "Miami" },
    { time: "18:00", team1: "Morocco", team2: "Haiti", group: "C", venue: "Atlanta" },
  ],
  "Jun 25 (Wed)": [
    { time: "19:00", team1: "Turkey", team2: "United States", group: "D", venue: "Los Angeles" },
    { time: "19:00", team1: "Paraguay", team2: "Australia", group: "D", venue: "San Francisco" },
    { time: "16:00", team1: "Curaçao", team2: "Ivory Coast", group: "E", venue: "Philadelphia" },
    { time: "16:00", team1: "Ecuador", team2: "Germany", group: "E", venue: "New York/NJ" },
    { time: "18:00", team1: "Japan", team2: "Sweden", group: "F", venue: "Dallas" },
    { time: "18:00", team1: "Tunisia", team2: "Netherlands", group: "F", venue: "Kansas City" },
  ],
  "Jun 26 (Thu)": [
    { time: "20:00", team1: "Egypt", team2: "Iran", group: "G", venue: "Seattle" },
    { time: "20:00", team1: "New Zealand", team2: "Belgium", group: "G", venue: "Vancouver" },
    { time: "19:00", team1: "Cape Verde", team2: "Saudi Arabia", group: "H", venue: "Houston" },
    { time: "18:00", team1: "Uruguay", team2: "Spain", group: "H", venue: "Guadalajara" },
    { time: "15:00", team1: "Norway", team2: "France", group: "I", venue: "Boston" },
    { time: "15:00", team1: "Senegal", team2: "Iraq", group: "I", venue: "Toronto" },
  ],
  "Jun 27 (Fri)": [
    { time: "21:00", team1: "Algeria", team2: "Austria", group: "J", venue: "Kansas City" },
    { time: "21:00", team1: "Jordan", team2: "Argentina", group: "J", venue: "Dallas" },
    { time: "19:30", team1: "Colombia", team2: "Portugal", group: "K", venue: "Miami" },
    { time: "19:30", team1: "DR Congo", team2: "Uzbekistan", group: "K", venue: "Atlanta" },
    { time: "17:00", team1: "Panama", team2: "England", group: "L", venue: "New York/NJ" },
    { time: "17:00", team1: "Croatia", team2: "Ghana", group: "L", venue: "Philadelphia" },
  ],
};

export const groups = [
  { name: "Group A", teams: ["Mexico", "South Africa", "South Korea", "Czech Republic"] },
  { name: "Group B", teams: ["Canada", "Bosnia & Herzegovina", "Qatar", "Switzerland"] },
  { name: "Group C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { name: "Group D", teams: ["United States", "Paraguay", "Australia", "Turkey"] },
  { name: "Group E", teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"] },
  { name: "Group F", teams: ["Netherlands", "Japan", "Sweden", "Tunisia"] },
  { name: "Group G", teams: ["Belgium", "Egypt", "Iran", "New Zealand"] },
  { name: "Group H", teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"] },
  { name: "Group I", teams: ["France", "Senegal", "Iraq", "Norway"] },
  { name: "Group J", teams: ["Argentina", "Algeria", "Austria", "Jordan"] },
  { name: "Group K", teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"] },
  { name: "Group L", teams: ["England", "Croatia", "Ghana", "Panama"] },
];

export const knockoutRounds = [
  { name: "Round of 32", dates: "Jun 28 – Jul 3", matches: 16 },
  { name: "Round of 16", dates: "Jul 4 – Jul 7", matches: 8 },
  { name: "Quarter-Finals", dates: "Jul 9 – Jul 11", matches: 4 },
  { name: "Semi-Finals", dates: "Jul 14 – Jul 15", matches: 2 },
  { name: "Third-Place Play-off", dates: "Jul 18", matches: 1, venue: "Miami" },
  { name: "Final", dates: "Jul 19", matches: 1, venue: "MetLife Stadium, New York/NJ" },
];
