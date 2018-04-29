/*
    Helper function that convert seconds to HMS format
 */

module.exports.secToHMS = (time) => {
    time = Number(time);

    let h = Math.floor(time / 3600);
    let m = Math.floor(time % 3600 / 60);
    let s = Math.floor(time % 3600 % 60);

    return `${h}h ${m}m ${s}s`;
}