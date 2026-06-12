"use client";

import Link from "next/link";
import { useState } from "react";

type Player = {
  name: string;
  age?: number;
  flat?: string;
  phone?: string;
  email?: string;
  isCaptain: boolean;
};

type Team = {
  name: string;
  players: Player[];
};

const kidsTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Nivin Saju", age: 12, flat: "6133", phone: "9495527837", email: "sajukallur@gmail.com", isCaptain: true },
      { name: "Aditya Sai Uppala", age: 14, flat: "-", phone: "-", email: "-", isCaptain: false },
      { name: "Swayash Jha", age: 12, flat: "3042", phone: "8861847081", email: "sdivyajha2008@gmail.com", isCaptain: false },
      { name: "Liyan Deshmukh", age: 9, flat: "7171", phone: "9178300000", email: "surbhisalode19@gmail.com", isCaptain: false },
      { name: "Alvin Jibi", age: 10, flat: "3051", phone: "9880356389", email: "jibijose@yahoo.com", isCaptain: false },
      { name: "Hanah M Mathew", age: 8, flat: "4164", phone: "7022369049", email: "mithinmathew007@gmail.com", isCaptain: false },
      { name: "Nithin Nambiar", age: 7, flat: "2172", phone: "8951582345", email: "nithin.nbr@hotmail.com", isCaptain: false },
      { name: "Rajen Shaw", age: 7, flat: "2024", phone: "9632570011", email: "sumitshaw007@gmail.com", isCaptain: false },
      { name: "Aryan Singh", flat: "2112", phone: "7022258494", email: "prabhat1607@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Aryush", age: 14, flat: "8152", phone: "9819267116", email: "robloxsecure067@gmail.com", isCaptain: true },
      { name: "Johan Shinu Mathew", age: 12, flat: "6164", phone: "8097294569", email: "johanshinu2014@gmail.com", isCaptain: false },
      { name: "Aayansh Singh", age: 11, flat: "5033", phone: "9590986094", email: "adivya3.singh@gmail.com", isCaptain: false },
      { name: "Krishang Sinha", age: 11, flat: "8041", phone: "8660903376", email: "kummadhuri.s@gmail.com", isCaptain: false },
      { name: "Riyanshu Guha", age: 9, flat: "8014", phone: "8095456785", email: "soumyak.guha@gmail.com", isCaptain: false },
      { name: "Aadhrit Pandey", age: 8, flat: "6074", phone: "9741226877", email: "pandeyabhavya2510@gmail.com", isCaptain: false },
      { name: "Kiara", age: 7, flat: "2174", phone: "9611101157", email: "sap.kunalap@gmail.com", isCaptain: false },
      { name: "Avyaan Biswas", age: 7, flat: "4121", phone: "9049813810", email: "biswasgaurav1@gmail.com", isCaptain: false },
      { name: "Dhruv Saharan", age: 11, flat: "4082", phone: "9886020304", email: "saharanram@yahoo.com", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Aaradhya Rawat", age: 13, flat: "7062", phone: "9873183855", email: "anilrawat15882ar@gmail.com", isCaptain: true },
      { name: "Antonio Rishon", age: 13, flat: "L-6063", phone: "9880603407", email: "ash.norbert@gmail.com", isCaptain: false },
      { name: "Priyanshu", age: 11, flat: "8003", phone: "6361686119", email: "9supriyapatil@gmail.com", isCaptain: false },
      { name: "Hreyansh", age: 11, flat: "5183", phone: "9845783377", email: "shweta.nic@gmail.com", isCaptain: false },
      { name: "Aaron Bennett", age: 10, flat: "L-6063", phone: "9945081024", email: "antben.1216@gmail.com", isCaptain: false },
      { name: "Uddeshya", age: 8, flat: "5143", phone: "8652224778", email: "utkarshi.p@gmail.com", isCaptain: false },
      { name: "Magizhan Ganeshan", age: 7, flat: "3143", phone: "9500174822", email: "tamilselviamity@gmail.com", isCaptain: false },
      { name: "Surya Raj", age: 7, flat: "2152", phone: "9185540000", email: "lakshmibs512@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Kunal", age: 13, flat: "5111", phone: "7353483115", email: "-", isCaptain: true },
      { name: "Utkarsh", age: 13, flat: "5183", phone: "9845783377", email: "shemendrakumar@hotmail.com", isCaptain: false },
      { name: "Aaryan Abhilash", age: 11, flat: "5124", phone: "9197390000", email: "abhilash.chalippat@gmail.com", isCaptain: false },
      { name: "Ritvik Chaturvedi", age: 11, flat: "5133", phone: "7406601601", email: "response.ritvik@gmail.com", isCaptain: false },
      { name: "Suyukth", age: 9, flat: "-", phone: "-", email: "drgknareshgoud@gmail.com", isCaptain: false },
      { name: "Naval Geete", age: 8, flat: "3034", phone: "9428573450", email: "geete.ashvin@gmail.com", isCaptain: false },
      { name: "Gianna Takhelmayum", age: 7, flat: "4042", phone: "9916246693", email: "gitrajit@gmail.com", isCaptain: false },
      { name: "Mayank Chauhan", age: 7, flat: "3104", phone: "9196630000", email: "mayank.r.chauhan@gmail.com", isCaptain: false },
      { name: "Satyam Pandey", age: 11, flat: "8073", phone: "-", email: "Sumant21k@gmail.com", isCaptain: false },
    ],
  },
];

const mensTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Chirag Tyagh", flat: "A1001", phone: "9599206101", email: "-", isCaptain: true },
      { name: "Sushant Kumar", flat: "2122", phone: "9643173925", email: "dashingsasuke@gmail.com", isCaptain: false },
      { name: "Rohan", flat: "5154", phone: "6363478396", email: "rohanreddy4640@gmail.com", isCaptain: false },
      { name: "Franklin Francis", flat: "8124", phone: "9986885362", email: "franklinfrancis995@gmail.com", isCaptain: false },
      { name: "Kishor", flat: "1067", phone: "8722814666", email: "kishor.rcr.08@gmail.com", isCaptain: false },
      { name: "Rithwik Sasikumar", flat: "2173", phone: "9447755778", email: "rithwik7sasikumar@gmail.com", isCaptain: false },
      { name: "Tushar", flat: "7111", phone: "9833588079", email: "tusharpawar3004@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Kshiraj Nair", flat: "8062", phone: "9880306334", email: "kshiraj2004@gmail.com", isCaptain: true },
      { name: "Shriragini Kowtarapu", flat: "8104", phone: "6300819297", email: "sairamragini@gmail.com", isCaptain: false },
      { name: "Sagar Kateel", flat: "Q-8004", phone: "9820208013", email: "sagarkateel03@gmail.com", isCaptain: false },
      { name: "Gitrajit", flat: "4042", phone: "7899177567", email: "gitrajit@gmail.com", isCaptain: false },
      { name: "Jay Patel", flat: "2132", phone: "8867822498", email: "jay08ec70@gmail.com", isCaptain: false },
      { name: "Chethan", flat: "8002", phone: "7899363535", email: "-", isCaptain: false },
      { name: "Satyaki Das", flat: "1076", phone: "9147768578", email: "satyakidas.work@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Anil Rawat", flat: "7062", phone: "9873183855", email: "anilrawat15882ar@gmail.com", isCaptain: true },
      { name: "Pankaj Kumawat", flat: "2061", phone: "9794326484", email: "pankajkumawat845@gmail.com", isCaptain: false },
      { name: "Sriram S", flat: "7131", phone: "9746033649", email: "sriramsharp@gmail.com", isCaptain: false },
      { name: "Pavan Itagi", flat: "8043", phone: "8971497765", email: "itagi75@gmail.com", isCaptain: false },
      { name: "Sachin Shiragola", flat: "6174", phone: "9591811199", email: "sachin.shiragola@gmail.com", isCaptain: false },
      { name: "Mitesh Rao V", flat: "7012", phone: "7829914246", email: "mallika.melingi@gmail.com", isCaptain: false },
      { name: "Arjun", flat: "5182", phone: "9902641107", email: "-", isCaptain: false },
      { name: "Pikanshu Kumar", flat: "7082", phone: "9835419814", email: "pikanshu.kr@gmail.com", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Mithin Mathew", flat: "4164", phone: "7022369049", email: "mithinmathew007@gmail.com", isCaptain: true },
      { name: "Mithun", flat: "7081", phone: "9052707150", email: "-", isCaptain: false },
      { name: "Nithin Nambiar", flat: "2172", phone: "8951582345", email: "nithin.nbr@hotmail.com", isCaptain: false },
      { name: "Praveesh", flat: "-", phone: "-", email: "-", isCaptain: false },
      { name: "Suvin", flat: "6152", phone: "9035689838", email: "-", isCaptain: false },
      { name: "Shanthibhushan", flat: "7013", phone: "9980997800", email: "shanthibhushanb@yahoo.co.in", isCaptain: false },
      { name: "Sarath", flat: "7163", phone: "9496353463", email: "-", isCaptain: false },
    ],
  },
];

const womensTeams: Team[] = [
  {
    name: "Team 1",
    players: [
      { name: "Preemy", isCaptain: true },
      { name: "Srilakshmi", isCaptain: false },
      { name: "Tanya", isCaptain: false },
      { name: "Reshma", isCaptain: false },
      { name: "Aiswarya", isCaptain: false },
    ],
  },
  {
    name: "Team 2",
    players: [
      { name: "Sushravya", isCaptain: true },
      { name: "Ahana", isCaptain: false },
      { name: "Aswathi", isCaptain: false },
      { name: "Fathima", isCaptain: false },
      { name: "Archana", isCaptain: false },
    ],
  },
  {
    name: "Team 3",
    players: [
      { name: "Maithri", isCaptain: true },
      { name: "Pavithra", isCaptain: false },
      { name: "Shruthi", isCaptain: false },
      { name: "Hana", isCaptain: false },
      { name: "Bakkiya", isCaptain: false },
    ],
  },
  {
    name: "Team 4",
    players: [
      { name: "Renjana", isCaptain: true },
      { name: "Anushka", isCaptain: false },
      { name: "Hala", isCaptain: false },
      { name: "Sreelakshmi", isCaptain: false },
      { name: "Surya", isCaptain: false },
    ],
  },
];

const sections = [
  { key: "kids", label: "Kids", color: "from-green-500 to-green-700", teams: kidsTeams, subtitle: "4 Teams · 35 Players · Ages 7–14" },
  { key: "mens", label: "Men's", color: "from-blue-500 to-blue-700", teams: mensTeams, subtitle: "4 Teams · 29 Players" },
  { key: "womens", label: "Women's", color: "from-pink-500 to-purple-600", teams: womensTeams, subtitle: "4 Teams · 20 Players" },
] as const;

export default function TeamsPage() {
  const [activeSection, setActiveSection] = useState<"kids" | "mens" | "womens">("kids");
  const current = sections.find((s) => s.key === activeSection)!;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link href="/" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
        ALL TEAMS
      </h1>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeSection === s.key
                ? `bg-gradient-to-r ${s.color} text-white shadow-lg scale-105`
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-gray-400 mb-6">{current.subtitle}</p>

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {current.teams.map((team) => (
          <div key={team.name} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 className="text-lg font-bold text-accent">{team.name}</h2>
            <div className="space-y-2">
              {team.players.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 rounded-lg ${
                    p.isCaptain ? "bg-accent/10 border border-accent/30" : "bg-white/5"
                  }`}
                >
                  <span className="font-semibold text-white text-sm">
                    {p.name}
                    {p.isCaptain && <span className="ml-1.5 text-accent text-xs">(C)</span>}
                  </span>
                  {p.age && (
                    <span className="text-xs text-gray-500">Age {p.age}</span>
                  )}
                  {p.flat && p.flat !== "-" && (
                    <span className="text-xs text-gray-500">Flat {p.flat}</span>
                  )}
                  {p.phone && p.phone !== "-" && (
                    <span className="text-xs text-gray-500">{p.phone}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
