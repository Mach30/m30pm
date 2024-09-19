import { expect } from "@oclif/test";
import ShortUniqueId from 'short-unique-id';
import seedrandom from "seedrandom";

describe("fs-guids test repeatable GUID generation", () => {
    it('should produce specified GUIDs, not random ones', () => {
        seedrandom('ad astra per civitatem', {global: true})
        var uid = new ShortUniqueId({ dictionary: 'hex' });
        console.log(uid.randomUUID(6))
        console.log(uid.randomUUID(6))
        console.log(uid.randomUUID(6))
        console.log(uid.randomUUID(6))

        // 27242e
        // e7e591
        // 915fd2
        // c2472d
    })
})