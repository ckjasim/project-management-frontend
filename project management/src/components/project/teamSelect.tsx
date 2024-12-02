// import { Users } from "lucide-react";
// import { useState } from "react";

// export const TeamSelect: React.FC<{ 
//   values: any; 
//   setFieldValue: (field: string, value: any) => void 
// }> = ({
//   values,
//   setFieldValue,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleTeamChange = (teamId: string) => {
//     const currentTeams = values?.teams || [];
//     const updatedTeams = currentTeams.includes(teamId)
//       ? currentTeams.filter((id: string) => id !== teamId)
//       : [...currentTeams, teamId];
    
//     setFieldValue('teams', updatedTeams);
//   };

//   const removeTeam = (teamId: string) => {
//     const updatedTeams = (values?.teams || []).filter((id: string) => id !== teamId);
//     setFieldValue('teams', updatedTeams);
//   };

//   return (
//     <div className="space-y-2">
//       <label
//         htmlFor="team-select"
//         className="flex items-center gap-2 text-sm font-semibold text-gray-700"
//       >
//         <Users size={18} className="text-gray-500" />
//         Select Teams
//       </label>

//       <div className="relative">
//         {/* Selected Teams Chips */}
//         {values?.teams?.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-2">
//             {values.teams.map((teamId: string) => {
//               const team = teams.find(t => t.id === teamId);
//               return team ? (
//                 <div 
//                   key={teamId} 
//                   className="flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs"
//                 >
//                   {team.name}
//                   <button 
//                     type="button"
//                     onClick={() => removeTeam(teamId)}
//                     className="ml-1 hover:text-blue-600"
//                   >
//                     <X size={12} />
//                   </button>
//                 </div>
//               ) : null;
//             })}
//           </div>
//         )}
//         <div 
//           onClick={() => !isLoading && setIsOpen(!isOpen)}
//           className={`
//             w-full rounded-lg border-2 bg-white px-4 py-3 pr-10 text-gray-700 
//             flex items-center justify-between cursor-pointer
//             ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
//             ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
//           `}
//         >
//           {values?.teams?.length > 0 
//             ? `${values.teams.length} team(s) selected` 
//             : 'Choose your teams...'}
          
//           <div className="flex items-center">
//             {isLoading ? (
//               <Loader2 className="animate-spin text-blue-500 w-5 h-5" />
//             ) : (
//               <ChevronDown className={`text-gray-400 w-5 h-5 ${isOpen ? 'rotate-180' : ''}`} />
//             )}
//           </div>
//         </div>

//         {/* Dropdown Menu */}
//         {isOpen && !isLoading && (
//           <div className="absolute z-10 w-full mt-1 bg-white border-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//             {teams.map((team) => (
//               <div 
//                 key={team.id}
//                 onClick={() => handleTeamChange(team.id)}
//                 className={`
//                   px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center
//                   ${(values?.teams || []).includes(team.id) ? 'bg-blue-100' : ''}
//                 `}
//               >
//                 <input 
//                   type="checkbox"
//                   checked={(values?.teams || []).includes(team.id)}
//                   readOnly
//                   className="mr-2 pointer-events-none"
//                 />
//                 {team.name}
//               </div>
//             ))}
//             <div 
//               onClick={() => {
//                 setFieldValue('teams', []);
//                 setIsOpen(false);
//               }}
//               className="px-4 py-2 text-center text-gray-500 hover:bg-gray-50 cursor-pointer border-t"
//             >
//               Clear Selection
//             </div>
//             <div 
//               onClick={() => {
//                 setIsAddingNewTeam(true);
//                 setIsOpen(false);
//               }}
//               className="px-4 py-2 text-center text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
//             >
//               + Create New Team
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };