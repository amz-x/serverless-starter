/**
 * Upload Timestamp Path Segment(s) Utility
 * 
 * Example:
 * 
 * ISO Date String: 2011-10-05T14:48:00.000Z
 * Date String Format: 2011-10-05
 * Time String Format: 144800000
 * 
 * Result: 2011-10-05/144800000
 */
export const getTimestampPath = (): string => {

  const uploadDate       = new Date().toISOString();
  const uploadDateSplit  = uploadDate.split('T');
  const uploadDateString = uploadDateSplit[0];
  const uploadTimeString = (((uploadDateSplit[1].substring(0, uploadDateSplit[1].length -1)).replace('.', '')).split(':')).join('');

  return `${uploadDateString}/${uploadTimeString}`;
};
