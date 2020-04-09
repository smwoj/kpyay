import {Version, Point} from "../store/models";

describe("Point", () => {

    it("correctly hashes params ", () => {
        const point = new Point(
            1.5,
            new Version(1, 2, 3),
            {team: "burgery", wege: "nie"},
            new Date("2012-04-14T00:02:00"),
            new Date("2012-04-14T00:02:30"),
        );

        expect(point.paramsHash()).toEqual("team=burgery, wege=nie");
    });
});