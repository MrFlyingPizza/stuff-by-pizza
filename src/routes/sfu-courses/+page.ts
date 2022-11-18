/** @type {import('./$types').PageLoad} */
export function load({ params }: { params: { year?: string, term?: string, department?: string } }) {
    return {
        year: params.year,
        term: params.term,
        department: params.department
    }
}