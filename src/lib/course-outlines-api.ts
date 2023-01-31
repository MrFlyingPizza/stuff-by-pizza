import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

export type WeekDayAbbreviations = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

export interface Year {
	text: string;
	value: string;
}

export interface Term {
	text: string;
	value: string;
}

export interface Department {
	text: string;
	value: string;
}

export interface Course {
	text: string;
	value: string;
	title: string;
}

export interface CourseSection {
	text: string;
	value: string;
	title: string;
	classType: string;
	sectionCode: string;
	associatedClass: string;
}

export interface Textbook {
	details: string;
}

export interface Instructor {
	name: string;
	lastName: string;
	firstName: string;
	commonName: string;
	office: string;
	offceHours: string;
	email: string;
	phone: string;
	roleCode: string;
	profileUrl: string;
}

export interface CourseSchedule {
	startTime: string;
	startDate: string;
	endTime: string;
	endDate: string;
	sectionCode: string;
	isExam: boolean;
	days: string;
	campus: string;
	buildingCode: string;
	roomNumber: string;
}

export interface CourseInfo {
	outlinePath: string;
	deliveryMethod: string;
	departmentalUgradNotes: string;
	designation: string;
	type: string;
	courseDetails: string;
	title: string;
	prerequisites: string;
	description: string;
	name: string;
	dept: string;
	educationalGoals: string;
	classNumber: string;
	shortNote: string;
	number: string;
	section: string;
	units: string;
	corequisites: string;
	registrarNotes: string;
	gradingNotes: string;
	term: string;
	notes: string;
	degreeLevel: string;
}

export interface CourseOutline {
	courseSchedule?: CourseSchedule[];
	info: CourseInfo;
	instructor: Instructor[];
	requiredText: Textbook[];
}

type YearsListRequestParams = object;
type TermsListRequestParams = YearsListRequestParams & {
	/**Which school year, 2010, 2011, 2023, etc. */
	year: string;
};
type DepartmentsListRequestParams = TermsListRequestParams & {
	/**Which semester, FALL, SUMMER, SPRING, etc. */
	term: string;
};
type CoursesListRequestParams = DepartmentsListRequestParams & {
	/**Which department, cmpt, bus, ca, etc. */
	dept: string;
};
type CourseSectionsListRequestParams = CoursesListRequestParams & {
	/**Which course number, 120, 105W, etc. Does not contain department abbreviation. */
	number: string;
};
type CourseOutlineRequestParams = CourseSectionsListRequestParams & {
	/**For the course indicated by the course number, this is the number of a section in that course, d100, e200, etc. */
	section: string;
};

const courseOutlinesApi = setupCache(
	axios.create({
		baseURL: 'https://www.sfu.ca/bin/wcm/course-outlines'
	}),
	{ cacheTakeover: false }
);

async function query<P extends object, R>(params: P, signal?: AbortSignal): Promise<R> {
	return courseOutlinesApi.get('', { params, signal }).then<R>((response) => response.data);
}

export async function getYears(signal?: AbortSignal) {
	return await query<YearsListRequestParams, Year[]>({}, signal);
}

export async function getTerms(params: TermsListRequestParams, signal?: AbortSignal) {
	return await query<TermsListRequestParams, Term[]>(params, signal);
}

export async function getDepartments(params: DepartmentsListRequestParams, signal?: AbortSignal) {
	return await query<DepartmentsListRequestParams, Department[]>(params, signal);
}

export async function getCourses(params: CoursesListRequestParams, signal?: AbortSignal) {
	return await query<CoursesListRequestParams, Course[]>(params, signal);
}

export async function getCourseSections(
	params: CourseSectionsListRequestParams,
	signal?: AbortSignal
) {
	return await query<CourseSectionsListRequestParams, CourseSection[]>(params, signal);
}

export async function getCourseOutline(params: CourseOutlineRequestParams, signal?: AbortSignal) {
	return await query<CourseOutlineRequestParams, CourseOutline>(params, signal);
}
