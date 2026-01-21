import { createAccessControl } from "better-auth/plugins";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

import type { AccessControl } from "better-auth/plugins";


const statement = {
   ...defaultStatements,
   teacher: ["view", "assign", "remove"],
   problem: ["create", "delete", "view", "modify", "personalise"],
   contest: ["create", "delete", "view", "modify", "personalise"],

} as const;

export const ac:AccessControl<typeof statement> = createAccessControl(statement);

export const user = ac.newRole({
   problem: ["view", "personalise"],
   teacher: ["view"],
   contest: ["view", "personalise"]
})


export const teacher = ac.newRole({
   problem: ["create", "delete", "view", "modify", "personalise"],
   teacher: ["view"],
   contest: ["create", "delete", "view", "modify", "personalise"],
})


export const admin = ac.newRole({
   teacher: ["view", "assign", "remove"],
   problem: ["create", "delete", "view", "modify", "personalise"],
   contest: ["create", "delete", "view", "modify", "personalise"],
   ...adminAc.statements,
})


