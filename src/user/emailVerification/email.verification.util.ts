import { emailTemplate } from '../../config/email/email.template';

export const generateVerificationcode = (): number => {
    const max = 9999;
    const min = 999;
    return Math.round(Math.random() * (max - min) + min);
};

export const emailVerificationTemplate = (code: number) =>
    emailTemplate(`
<div style = "text-align: center; height: 40em; width: 100%">
    <h2 style = "font-size: 24px;" >Here Is Your Verification Code</h2>
    <div style = " padding-top= 2.5em; background-color: #112347; margin: auto; width: 85%; height: 4em; border-radius:8px; color: white; font-size: 17px">
        <h2>
            ${code}
        </h2>
    </div>
</div>
`);

export const adminEmailVerificationTemplate = (code: number) =>
    emailTemplate(`
<div style = "text-align: center; height: 40em; width: 100%">
    <h2 style = "font-size: 24px;" >Here Is Your Verification Code</h2>
    <div style = " padding-top= 2.5em; background-color: #112347; margin: auto; width: 85%; height: 4em; border-radius:8px; color: white; font-size: 17px">
        <h2>
            ${code}
        </h2>
        <a href="">
            <span>Register</span>
        </a>
    </div>
</div>
`);
