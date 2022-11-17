export const BASE_URL = 'http://www.sfu.ca/bin/wcm/course-outlines?'
export const ABBR_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export interface Year {
    text: string
    value: string
}

export interface Term {
    text: string
    value: string
}

export interface Department {
    text: string
    value: string
}

export interface Course {
    text: string
    value: string
    title: string
}

export interface Section {
    text: string
    value: string
    title: string
    classType: string
    sectionCode: string
    associatedClass: string
}

export interface Textbook {
    details: string
}

export interface Instructor {
    name: string
    lastName: string
    firstName: string
    commonName: string
    office: string
    offceHours: string
    email: string
    phone: string
    roleCode: string
    profileUrl: string
}

export interface CourseSchedule {
    startTime: string
    startDate: string
    endTime: string
    endDate: string
    sectionCode: string
    isExam: boolean
    days: string
    campus: string
    buildingCode: string
    roomNumber: string
}

export interface CourseInfo {
    outlinePath: string
    deliveryMethod: string
    departmentalUgradNotes: string
    designation: string
    type: string
    courseDetails: string
    title: string
    prerequisites: string
    description: string
    name: string
    dept: string
    educationalGoals: string
    classNumber: string
    shortNote: string
    number: string
    section: string
    units: string
    corequisites: string
    registrarNotes: string
    gradingNotes: string
    term: string
    notes: string
    degreeLevel: string
}

export interface CourseOutline {
    courseSchedule: CourseSchedule[]
    info: CourseInfo
    instructor: Instructor[]
    requiredText: Textbook[]
}

export function buildUrl(
    year?: string,
    term?: string,
    department?: string,
    courseNumber?: string,
    courseSection?: string
): string {
    let result = BASE_URL

    for (const pathVar of [year, term, department, courseNumber, courseSection]) {
        if (!pathVar) break
        result += pathVar + '/'
    }
    return result
}

export async function getYears(abortController?: AbortController) {
    return await fetch(buildUrl(), { signal: abortController?.signal }).then<Year[]>(response => response.json())
}

export async function getTerms(year: string, abortController?: AbortController) {
    return await fetch(buildUrl(year), { signal: abortController?.signal }).then<Term[]>(response => response.json())
}

export async function getDepartments(year: string, term: string, abortController?: AbortController) {
    return await fetch(buildUrl(year, term), { signal: abortController?.signal }).then<Department[]>(response => response.json())
}

export async function getCourses(year: string, term: string, department: string, abortController?: AbortController) {
    return await fetch(buildUrl(year, term, department), { signal: abortController?.signal }).then<Course[]>(response => response.json())
}

export async function getSections(year: string, term: string, department: string, courseNumber: string, abortController?: AbortController) {
    return await fetch(buildUrl(year, term, department, courseNumber), { signal: abortController?.signal }).then<Section[]>(response => response.json())
}

export async function getCourseOutline(year: string, term: string, department: string, courseNumber: string, courseSection: string, abortController?: AbortController) {
    return await fetch(buildUrl(year, term, department, courseNumber, courseSection), { signal: abortController?.signal }).then<CourseOutline>(response => response.json())
}
