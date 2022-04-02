interface AlphabetMap { [key: string]: string; }

interface ColorsetMap { [key: string]: ColorDefinition[]; }

interface ColorDefinition { color: string, count?: number}

interface Layer { fontSize: number, speed: number, brightness: number, filter: string}