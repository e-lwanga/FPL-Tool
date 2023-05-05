import { getServerAddress } from ".";

export async function fetchBootstrapStatic(){
    const response=await fetch(`${getServerAddress()}/get-bootstrap-static`);
    return await response.json();
}

export async function fetchManagerEntryData(managerId){
    const response=await fetch(`${getServerAddress()}/get-manager-entry-data/${managerId}`);
    return await response.json();
}

export async function fetchElementDetailedData(elementId){
    const response=await fetch(`${getServerAddress()}/get-element-detailed-data/${elementId}`);
    return await response.json();
}

export async function fetchManagerEntryEventData(managerId,eventId){
    const response=await fetch(`${getServerAddress()}/get-manager-entry-event-data/${managerId}/${eventId}`);
    return await response.json();
}