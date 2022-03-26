export const emailVerificationMock = (
    email = "ricksanchez@gmail.com",
    role = "USER",
    verificationCode = 1235,
    verified = true
) => ({
    email, verificationCode, verified, role
})