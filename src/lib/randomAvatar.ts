import * as jose from 'jose';

const AvatarStyleCount = {
  face: 15,
  nose: 13,
  mouth: 19,
  eyes: 13,
  eyebrows: 15,
  glasses: 14,
  hair: 58,
  accessories: 14,
  details: 13,
  beard: 16,
};
export const randomAvatar = async () => {
  const config = Object.keys(AvatarStyleCount).reduce(
    (prev, next) =>
      Object.assign(prev, {
        [next]: Math.floor(
          Math.random() * (AvatarStyleCount[next as keyof typeof AvatarStyleCount] + 1),
        ),
      }),
    {} as Record<keyof typeof AvatarStyleCount, number>,
  );
  // for harmony
  config.beard = 0;
  config.details = 0;
  config.accessories = 0;

  const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
  );
  const encoded: string = await new jose.SignJWT(config)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

  // 📣 Shout out to https://github.com/mayandev/notion-avatar
  const imgSrc = `https://notion-avatar.vercel.app/api/img/${encoded.split('.')[1]}`;
  return imgSrc;
};
