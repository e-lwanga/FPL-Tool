console.clear();
const FPL_API_HELPER=require("./fpl_api_helper");

//async run
async function run(){

    // const managerId="1225149";
    const managerId=process.argv[2];
    if(!managerId){
        console.log("Please execute with manager id as command line argument");
        return;
    }


    console.log(`FETCHING MANAGER DETAILS\n`);
    const managerEntryData=await FPL_API_HELPER.fetchManagerEntryData(managerId);

    console.log(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}]\n\n`);

    // managerEntryData.current_event=managerEntryData.started_event+1; //HACK

    console.log(`PREPARING BOOTSTRAP STATIC`);
    const bootstrapStatic=await FPL_API_HELPER.fetchBootstrapStatic();

    // console.log(bootstrapStatic);
    // console.log(Object.keys(bootstrapStatic));

    console.log(`\n\n`);




    const managerEventsPicks=[];
    const managerUsedElementsDetailedData={};

    for(let eventId=managerEntryData.started_event; eventId!=null && eventId<=managerEntryData.current_event;eventId++){
        console.log(`ANALYSING EVENT ${eventId} ...`);

        const eventData=await FPL_API_HELPER.fetchManagerEntryEventData(managerId,eventId);

        // console.log(eventData);

        console.log(`score: +${eventData.entry_history.points}[${eventData.entry_history.rank}] => ${eventData.entry_history.total_points}[${eventData.entry_history.overall_rank}]`);
        console.log(`active chip: ${eventData.active_chip||"none"}`);
        console.log("\n");

        for(const pick of eventData.picks){
            const pickElementObj=(function(){
                for(const element of bootstrapStatic.elements){
                    if(element.id==pick.element){
                        return element;
                    }
                }
                return null; //likely to never happen
            })();

            const pickTeamObj=(function(){
                for(const team of bootstrapStatic.teams){
                    if(team.id==pickElementObj.team){
                        return team;
                    }
                }
                return null; //likely to never happen
            })();


            if(!managerUsedElementsDetailedData[`${pickElementObj.id}`]){
                console.log("***");
                managerUsedElementsDetailedData[`${pickElementObj.id}`] = await FPL_API_HELPER.fetchElementDetailedData(pickElementObj.id);

                await new Promise(function(resolve,reject){
                    setTimeout(function(){
                        resolve();
                    },2000);
                });
            }

            const elementDetailedData=managerUsedElementsDetailedData[`${pickElementObj.id}`];

            // console.log(elementDetailedData.history);

            const pickGameweekMatchesTotalPoints=(function(){
                let totalPoints=0;
                for(const item of elementDetailedData.history){
                    if(`${item.round}`==`${eventId}`){
                        totalPoints+=item.total_points;
                    }
                }
                return totalPoints;
            })();

            console.log(`> ${pickElementObj.web_name} (${pickTeamObj.short_name}) -> +${pickGameweekMatchesTotalPoints}`);


            // console.log(`\n`);
        }


        managerEventsPicks.push(eventData);

        console.log("..............................\n\n");

        await new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve();
            },2000);
        });
    }

    // console.log(managerEventsPicks);


}

run();













// // Function to get player performance data for a given manager ID
// async function getPlayerData(managerId) {

//     console.log("FETCHING BOOTSTRAP STATIC");
//     const bootstrapData = await fetchBootstrapStatic();

//     console.log("FETCHING MANAGER DATA",managerId);
//     const playerData = await fetchPlayerData(managerId);

//     // console.log(playerData);

//     const currentEvent = playerData.entry.current_event;

//     const playerDataByElement = {};
//     playerData.picks.forEach((pick) => {
//         const elementId = pick.element;
//         if (!playerDataByElement[elementId]) {
//         playerDataByElement[elementId] = {
//             element: bootstrapData.elements.find((element) => element.id === elementId),
//             stats: {
//             minutes: 0,
//             goalsScored: 0,
//             assists: 0,
//             totalPoints: 0,
//             },
//         };
//         }
//         const playerStats = playerDataByElement[elementId].stats;
//         playerStats.minutes += pick.stats.minutes;
//         playerStats.goalsScored += pick.stats.goals_scored;
//         playerStats.assists += pick.stats.assists;
//         playerStats.totalPoints += pick.stats.total_points;
//     });

//     const playerDataByPerformance = [];
//     Object.keys(playerDataByElement).forEach((elementId) => {
//         const playerStats = playerDataByElement[elementId].stats;
//         const playerPerformance = {
//         player: playerDataByElement[elementId].element,
//         minutes: playerStats.minutes,
//         goalsScored: playerStats.goalsScored,
//         assists: playerStats.assists,
//         totalPoints: playerStats.totalPoints,
//         };
//         playerDataByPerformance.push(playerPerformance);
//     });

//     return playerDataByPerformance;
// }

// // Function to rank players by a given performance metric
// function rankPlayers(playerData, metric) {
//   return playerData.sort((a, b) => b[metric] - a[metric]);
// }

// // Usage example
// (async () => {
//   const playerData = await getPlayerData(MANAGER_ID);
//   const rankedByPoints = rankPlayers(playerData, 'totalPoints');
//   console.log('Players ranked by total points:');
//   console.table(rankedByPoints);
// })();
