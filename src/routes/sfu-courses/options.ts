import { browser } from "$app/environment";
import { writable } from "svelte/store";

const yearVal = browser ? localStorage.year : ''
const termVal = browser ? localStorage.term : ''
const departmentVal = browser ? localStorage.department : ''

export const year = writable<string>(yearVal)
export const term = writable<string>(termVal)
export const department = writable<string>(departmentVal)

year.subscribe((val: string) => {
    if (browser) localStorage.year = val
})
term.subscribe((val: string) => {
    if (browser) localStorage.term = val
})
department.subscribe((val: string) => {
    if (browser) localStorage.department = val
})