export const ACCESS: Record<string,string>;
export function defaultAccess(role:string):string[];
export function accessFor(user:{role:string;permissions?:string[]}):string[];
export function checkAccessChange(collection:string,old:unknown,next:unknown,user:{role:string;permissions?:string[]}):string|null;
