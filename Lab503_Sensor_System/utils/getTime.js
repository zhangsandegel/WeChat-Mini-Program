function getTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // 获取小时，并确保是两位数
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取分钟，并确保是两位数
    const seconds = now.getSeconds().toString().padStart(2, '0'); // 获取秒，并确保是两位数
    const milliseconds = now.getMilliseconds().toString().padStart(4, '0'); // 获取毫秒，并确保是四位数

    const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    return formattedTime; // 输出类似于 "14:30:45.1234" 的时间格式
}

module.exports = {
    getTime: getTime
};