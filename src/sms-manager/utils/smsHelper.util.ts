export const normalizePhoneNumber = (phoneNumber: string): string => {
  let sendTo = phoneNumber;

  /**
   * In case this is not a production environment check if the phone number is whitelisted
   * If it is not whitelisted and not production then send to the DEV_PHONE
   */
  // if (!isProd && !config.notifications.whitelist.phoneNumbers.includes(phoneNumber)) {
  //   sendTo = config.notifications.devPhone;
  // }

  if (sendTo.indexOf("0") === 0) {
    if (sendTo[0] === "0") sendTo = sendTo.replace("0", "+972");
    else if (sendTo.indexOf("00972") === 0)
      sendTo = sendTo.replace("00972", "+972");
  }

  return sendTo;
};