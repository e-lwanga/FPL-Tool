import { useEffect, useRef } from "react";
import { ArrayGenerated, Builder, PromiseSnapshotElement, ValueListenerElement } from "../my_util_components";
import { CircularProgress } from "@mui/material";
import { fetchBootstrapStatic, fetchElementDetailedData, fetchManagerEntryData, fetchManagerEntryEventData } from "../server_functions";

export default function AnalyserRoute() {

    const managerId = window.location.pathname.split("/")[1];

    const analysableCreationLoggableValueNotifierRef = useRef(new ValueListenerElement.ValueNotifier(null));

    const analysableCreaterValueNotifierRef = useRef(new ValueListenerElement.ValueNotifier(null));

    const analysableCreater = async function () {

        // throw "xxxxx";

        analysableCreationLoggableValueNotifierRef.current.setValue(`OBTAINING MANAGER DETAILS`);
        // console.log(`FETCHING MANAGER DETAILS\n`);

        const managerEntryData = await fetchManagerEntryData(managerId);


        analysableCreationLoggableValueNotifierRef.current.setValue(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}] from GW: ${managerEntryData.started_event}`);

        // console.log(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}], Started Gameweek: ${managerEntryData.started_event}\n\n`);

        // managerEntryData.current_event = managerEntryData.started_event + 0; //HACK

        
        analysableCreationLoggableValueNotifierRef.current.setValue(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}] from GW: ${managerEntryData.started_event}. PREPARING BOOTSTRAP STATIC - HEAVY OBJECT`);
        // console.log(`PREPARING BOOTSTRAP STATIC`);
        const bootstrapStatic = await fetchBootstrapStatic();

        // console.log(bootstrapStatic);
        // console.log(Object.keys(bootstrapStatic));



        const managerPlayedEventsDataCache = {};
        const managerUsedElementsDetailedDataCache = {};

        for (let eventId = managerEntryData.started_event; eventId != null && eventId <= managerEntryData.current_event; eventId++) {


            analysableCreationLoggableValueNotifierRef.current.setValue(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}] from GW: ${managerEntryData.started_event}.\nANALYSING GAMEWEEK: ${eventId}`);
            // console.log(`\nGETTING GAMEWEEK ${eventId} ...`);

            const eventData = await fetchManagerEntryEventData(managerId, eventId);

            // console.log(eventData);

            managerPlayedEventsDataCache[`${eventId}`] = eventData;

            for (const pick of eventData.picks) {
                const pickElementObj = (function () {
                    for (const element of bootstrapStatic.elements) {
                        if (element.id === pick.element) {
                            return element;
                        }
                    }
                    return null; //likely to never happen
                })();


                if (!managerUsedElementsDetailedDataCache[`${pickElementObj.id}`]) {

                    analysableCreationLoggableValueNotifierRef.current.setValue(`Manager: ${managerEntryData.name} [${managerEntryData.player_first_name} ${managerEntryData.player_last_name}] from GW: ${managerEntryData.started_event}.\nANALYSING GAMEWEEK: ${eventId}.\nINDEXING... [#${pickElementObj.id}] ${pickElementObj.first_name} ${pickElementObj.second_name}`);
                    // console.log(`PREPARING... [#${pickElementObj.id}] ${pickElementObj.first_name} ${pickElementObj.second_name}`);
                    managerUsedElementsDetailedDataCache[`${pickElementObj.id}`] = await fetchElementDetailedData(pickElementObj.id);
                }

            }

        }


        analysableCreationLoggableValueNotifierRef.current.setValue(null);



        const analysable = {
            managerEntryData,
            bootstrapStatic,
            managerPlayedEventsDataCache,
            managerUsedElementsDetailedDataCache,
        };


        return analysable;

    }

    useEffect(function () {
        analysableCreaterValueNotifierRef.current.setValue(analysableCreater());
    });



    return (
        <section style={{
            width: "100%",
            height: "100%",
        }}>
            <ValueListenerElement valueNotifier={analysableCreaterValueNotifierRef.current} renderer={function (value) {
                if (value === null) {
                    return null;
                }
                return <PromiseSnapshotElement promise={value} renderer={function (snapshot) {
                    if (snapshot.resolvedRejected === null) {
                        return (
                            <section style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection:"column",
                            }}>
                                <section style={{
                                        padding: "20px",
                                        textAlign:"center",
                                        whiteSpace:"pre-wrap",
                                    }}>
                                        Created by Emmanuel Lwanga
                                    </section>
                                <CircularProgress />
                                <ValueListenerElement valueNotifier={analysableCreationLoggableValueNotifierRef.current} renderer={function (value) {
                                    if (value === null) {
                                        return null;
                                    }
                                    return <section style={{
                                        padding: "20px",
                                        textAlign:"center",
                                        whiteSpace:"pre-wrap",
                                    }}>
                                        {`${value}`}
                                    </section>
                                }} />

                            </section>
                        );
                    }
                    if (snapshot.resolvedRejected === false) {
                        return (
                            <section style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <section style={{
                                    textAlign: "center",
                                }}>An error occured {`${snapshot.data}`}</section>
                            </section>
                        );
                    }

                    const {
                        managerEntryData,
                        bootstrapStatic,
                        managerPlayedEventsDataCache,
                        managerUsedElementsDetailedDataCache,
                    } = snapshot.data;

                    const gameweeksCount = managerEntryData.current_event; //for some reason this value is bureaucratic to get from bootstrapStatis so we shall use the managerEntryData.current_event which shouldn't be logically right though



                    const deabstracter = {};

                    for (const elementId_string of Object.keys(managerUsedElementsDetailedDataCache)) {
                        const elementDetailedData = managerUsedElementsDetailedDataCache[elementId_string];

                        const elementObj = (function () {
                            for (const element of bootstrapStatic.elements) {
                                if (`${element.id}` === elementId_string) {
                                    return element;
                                }
                            }
                            return null; //likely to never happen
                        })();

                        const elementAnalysisObj = {};

                        elementAnalysisObj._names = `${elementObj.first_name} ${elementObj.second_name}`;
                        elementAnalysisObj.gameweeks = {};

                        for (let gw = 1; gw <= gameweeksCount; gw++) {
                            const managerPlayedEventData = managerPlayedEventsDataCache[`${gw}`];

                            let elementPicked = false;
                            let elementWasCaptain = false;
                            let managerPickedElementOnStartTeam = false;
                            let elementAutoSubMoved = false;

                            for (const pick of managerPlayedEventData.picks) {
                                if (`${pick.element}` === elementId_string) {
                                    elementPicked = true;
                                    if (pick.is_captain) {
                                        elementWasCaptain = true;
                                    }
                                    managerPickedElementOnStartTeam = pick.multiplier > 0;
                                    for (const autoSub of managerPlayedEventData.automatic_subs) {
                                        if (autoSub.element_in === pick.element) {
                                            elementAutoSubMoved = !elementAutoSubMoved;
                                        }
                                        if (autoSub.element_out === pick.element) {
                                            elementAutoSubMoved = !elementAutoSubMoved;
                                        }
                                    }
                                    if (elementAutoSubMoved) {
                                        managerPickedElementOnStartTeam = !managerPickedElementOnStartTeam;
                                    }
                                }
                            }

                            const gwPlayedFixturesObj = [];
                            for (const item of elementDetailedData.history) {
                                if (item.round === gw) {

                                    const opponentTeamObj = (function () {
                                        for (const team of bootstrapStatic.teams) {
                                            if (team.id === item.opponent_team) {
                                                return team;
                                            }
                                        }
                                        return null; //likely to never happen
                                    })();

                                    gwPlayedFixturesObj.push({
                                        opponentTeamId: item.opponent_team,
                                        wasHome: item.was_home,
                                        totalPoints: item.total_points,
                                        _opponentTeamShortName: opponentTeamObj.short_name,
                                    });
                                }
                            }

                            elementAnalysisObj.gameweeks[`${gw}`] = {
                                fixtures: gwPlayedFixturesObj,
                                elementPicked,
                                managerPickedElementOnStartTeam,
                                elementAutoSubMoved,
                                elementWasCaptain,
                            };

                        }

                        deabstracter[`#${elementObj.id}`] = elementAnalysisObj;
                    }




                    const playersIds_strings = Object.keys(deabstracter);

                    const tableCellDefStyle = {
                        border: "1px solid black",
                        padding: 4,
                        fontSize: "12px",
                    };

                    return (
                        <section>
                            <table style={{
                                borderCollapse: "collapse",
                                maxWidth: "auto",
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            ...tableCellDefStyle,
                                        }}>Player</th>
                                        <ArrayGenerated count={gameweeksCount} getIndexComponent={function (index) {
                                            return (
                                                <th style={{
                                                    ...tableCellDefStyle,
                                                }}>{`GW${index + 1}`}</th>
                                            );
                                        }} />
                                        <th style={{
                                            ...tableCellDefStyle,
                                        }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ArrayGenerated count={playersIds_strings.length} getIndexComponent={function (index) {
                                        const playerId_string = playersIds_strings[index];

                                        const deabstracterPlayerObj = deabstracter[playerId_string];

                                        return (
                                            <tr>
                                                <td style={{
                                                    ...tableCellDefStyle,
                                                }}>{`${deabstracterPlayerObj._names}`}</td>
                                                <ArrayGenerated count={gameweeksCount} getIndexComponent={function (index) {
                                                    const playerGwObj = deabstracterPlayerObj.gameweeks[`${index + 1}`];
                                                    // console.table(playerGwObj);
                                                    const fixturesRepresentations = [];
                                                    for (const fixture of playerGwObj.fixtures) {
                                                        fixturesRepresentations.push(`<${fixture._opponentTeamShortName}/${fixture.wasHome ? `H` : `A`}> ${fixture.totalPoints}`);
                                                    }

                                                    return (
                                                        <td style={{
                                                            ...tableCellDefStyle,
                                                        }}>{`${fixturesRepresentations.join(", ")} ${playerGwObj.elementPicked ? `[${playerGwObj.managerPickedElementOnStartTeam ? `+${playerGwObj.elementAutoSubMoved ? `-` : `+`}` : `-${playerGwObj.elementAutoSubMoved ? `+` : `-`}`}]` : ``} ${playerGwObj.elementWasCaptain ? `**` : ``}`}</td>
                                                    );
                                                }} />
                                                <td style={{
                                                    ...tableCellDefStyle,
                                                }}>
                                                    <Builder renderer={function () {
                                                        let overallTotal = 0;
                                                        let pickedInGameweekTotal = 0;
                                                        let contributingTotal = 0;
                                                        for (let i = 1; i <= gameweeksCount; i++) {
                                                            const playerGwObj = deabstracterPlayerObj.gameweeks[`${i}`];
                                                            let gameweekTotalPoints = 0;
                                                            for (const fixture of playerGwObj.fixtures) {
                                                                gameweekTotalPoints += fixture.totalPoints;
                                                            }
                                                            overallTotal += gameweekTotalPoints;
                                                            if (playerGwObj.elementPicked) {
                                                                pickedInGameweekTotal += gameweekTotalPoints;
                                                                if (playerGwObj.managerPickedElementOnStartTeam !== playerGwObj.elementAutoSubMoved) {
                                                                    contributingTotal += gameweekTotalPoints;
                                                                }
                                                            }
                                                        }
                                                        return `${contributingTotal} [+${pickedInGameweekTotal - contributingTotal} : ${pickedInGameweekTotal}] | ${overallTotal}`;
                                                    }} />
                                                </td>
                                            </tr>
                                        );
                                    }} />
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td style={{
                                            ...tableCellDefStyle,
                                        }}>Total</td>
                                        <ArrayGenerated count={gameweeksCount} getIndexComponent={function (index) {
                                            let pickedInGameweekTotal = 0;
                                            let contributingTotal = 0;
                                            for (const playerId_string of Object.keys(deabstracter)) {
                                                const deabstracterPlayerObj = deabstracter[`${playerId_string}`];
                                                const playerGwObj = deabstracterPlayerObj.gameweeks[`${index + 1}`];
                                                let gameweekTotalPoints = 0;
                                                for (const fixture of playerGwObj.fixtures) {
                                                    gameweekTotalPoints += fixture.totalPoints;
                                                }
                                                if (playerGwObj.elementPicked) {
                                                    pickedInGameweekTotal += gameweekTotalPoints;
                                                    if (playerGwObj.managerPickedElementOnStartTeam !== playerGwObj.elementAutoSubMoved) {
                                                        contributingTotal += gameweekTotalPoints;
                                                    }
                                                }
                                            }
                                            return <td style={{
                                                ...tableCellDefStyle,
                                            }}>
                                                {`${contributingTotal} [+${pickedInGameweekTotal - contributingTotal} : ${pickedInGameweekTotal}]`}
                                            </td>
                                        }} />
                                        <td style={{
                                            ...tableCellDefStyle,
                                        }}>
                                            ...
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>
                    );
                }} />
            }} />
        </section>
    );
}