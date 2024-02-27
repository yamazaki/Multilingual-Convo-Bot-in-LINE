export function getUnixTimeInSeconds(): string {
    // 現在の時刻を取得
    const currentDate = new Date();
  
    // Unix時刻（秒単位）に変換
    const unixTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
  
    return unixTimeInSeconds.toString();
}