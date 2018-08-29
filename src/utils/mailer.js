
export function sendResetPasswordEmail(user) {
    const email = {
        from : 'from_sys_admin',
        to : user.email,
        subject : 'Reset password',
        text : `Please reset your password. click on this link 
                ${user.generateResetPasswordLink()}
        `
    };

    //in real production application this is the point where we would REALY send the email :)
    //we could use nodemailer or some other 3rd party library
    //sendEmail(email);
}