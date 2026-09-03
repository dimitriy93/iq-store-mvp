export class XmlParser {
    static parseFromString(xmlString: string): Document {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const parseError = xmlDoc.getElementsByTagName("parsererror");

        if (parseError.length > 0) {
            throw new Error('Ошибка валидации XML');
        }

        return xmlDoc;
    }
}