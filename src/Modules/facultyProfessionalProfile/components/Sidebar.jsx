// /* eslint-disable jsx-a11y/anchor-is-valid */
// import { useState } from "react";
// import {
//   Home,
//   Book,
//   FileText,
//   FileSearch,
//   UserCheck,
//   Activity,
//   MessageSquare,
//   Users,
//   Briefcase,
//   Building,
//   User,
//   Settings,
//   HelpCircle,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// export default function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const menuItems = [
//     { icon: Home, label: "Home" },
//     { icon: Book, label: "Academics" },
//     { icon: FileText, label: "Curriculum" },
//     { icon: FileSearch, label: "File Tracking" },
//     { icon: UserCheck, label: "HR" },
//     { icon: Activity, label: "Health" },
//     { icon: MessageSquare, label: "Research" },
//     { icon: Users, label: "Complain" },
//     { icon: Briefcase, label: "Placement" },
//     { icon: Building, label: "Department" },
//     { icon: Users, label: "Gymkhana" },
//     { icon: Home, label: "Visitor's Hostel" },
//     { icon: Settings, label: "Other" },
//   ];

//   return (
//     <div
//       className={`flex flex-col h-[890px] bg-white transition-all duration-300 overflow-y-auto ${isCollapsed ? "w-16" : "w-56"}`}
//     >
//       <div className="p-4 flex justify-center">
//         <img src="/placeholder.svg" alt="Logo" className="w-12 h-12" />
//       </div>
//       <nav className="flex-1">
//         {menuItems.map((item, index) => (
//           <a
//             key={index}
//             href="#"
//             className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
//           >
//             <item.icon className="w-5 h-5 mr-2" />
//             {!isCollapsed && <span>{item.label}</span>}
//           </a>
//         ))}
//       </nav>
//       <div className="p-4">
//         <a
//           href="#"
//           className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2"
//         >
//           <User className="w-5 h-5 mr-2" />
//           {!isCollapsed && <span>Profile</span>}
//         </a>
//         <a
//           href="#"
//           className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2"
//         >
//           <Settings className="w-5 h-5 mr-2" />
//           {!isCollapsed && <span>Settings</span>}
//         </a>
//         <a
//           href="#"
//           className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2"
//         >
//           <HelpCircle className="w-5 h-5 mr-2" />
//           {!isCollapsed && <span>Help</span>}
//         </a>
//       </div>
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
//       >
//         {isCollapsed ? (
//           <ChevronRight className="w-5 h-5" />
//         ) : (
//           <ChevronLeft className="w-5 h-5" />
//         )}
//       </button>
//     </div>
//   );
// }

// // import React, { useState, useEffect } from 'react';
// // import { AiOutlineHome, AiOutlineProfile, AiOutlineProject, AiOutlineFundProjectionScreen, AiOutlineSetting, AiOutlineQuestionCircle } from 'react-icons/ai';
// // import { BsChevronRight, BsChevronDown } from 'react-icons/bs';

// // const Sidebar = ({ setSelectedSection }) => {
// //   const [isCollapsed, setIsCollapsed] = useState(false);

// //   const sections = [
// //     { name: 'Home', icon: <AiOutlineHome /> },
// //     { name: 'Professional Profile', icon: <AiOutlineProfile /> },
// //     { name: 'Projects', icon: <AiOutlineProject /> },
// //     { name: 'Patents', icon: <AiOutlineFundProjectionScreen /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //     { name: 'Technology Transfer', icon: <AiOutlineProject /> },
// //   ];

// //   return (
// //     <div className={`flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-64'} bg-gray-100 p-4 transition-all duration-300`}>
// //       {/* Logo */}
// //       <div className="flex justify-center mb-4">
// //         <img src="your-logo-src.png" alt="Logo" className={`h-12 ${isCollapsed ? 'hidden' : 'block'}`} />
// //       </div>

// //       {/* Collapse Toggle */}
// //       <div className="flex justify-end mb-4">
// //         <button onClick={() => setIsCollapsed(!isCollapsed)} className="focus:outline-none">
// //           {isCollapsed ? <BsChevronRight /> : <BsChevronDown />}
// //         </button>
// //       </div>

// //       {/* Sidebar Sections */}
// //       <ul className="flex-grow">
// //         {sections.map((section, index) => (
// //           <li
// //             key={index}
// //             className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
// //             onClick={() => setSelectedSection(section.name)}
// //           >
// //             <span className="text-lg">{section.icon}</span>
// //             {!isCollapsed && <span className="ml-4">{section.name}</span>}
// //           </li>
// //         ))}
// //       </ul>

// //       {/* Footer Icons */}
// //       <div className="mt-auto">
// //         <ul>
// //           <li className="flex items-center p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setSelectedSection('Profile')}>
// //             <AiOutlineProfile />
// //             {!isCollapsed && <span className="ml-4">Profile</span>}
// //           </li>
// //           <li className="flex items-center p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setSelectedSection('Settings')}>
// //             <AiOutlineSetting />
// //             {!isCollapsed && <span className="ml-4">Settings</span>}
// //           </li>
// //           <li className="flex items-center p-2 hover:bg-gray-200 cursor-pointer" onClick={() => setSelectedSection('Help')}>
// //             <AiOutlineQuestionCircle />
// //             {!isCollapsed && <span className="ml-4">Help</span>}
// //           </li>
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;
