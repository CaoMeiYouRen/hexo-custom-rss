import xml2js from 'xml2js'
export function json2xml(obj: any, options?: xml2js.BuilderOptions) {
    const builder = new xml2js.Builder({ rootName: 'xml', ...options })
    return builder.buildObject(obj)
}

export async function xml2json(str: string) {
    const parser = new xml2js.Parser({
        normalize: true,
        normalizeTags: false,
        explicitArray: false,
        explicitRoot: false,
    })
    return parser.parseStringPromise(str)
}
