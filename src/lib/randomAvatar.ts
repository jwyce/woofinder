export const randomAvatar = async (name: string) => {
  const [firstName, lastName] = name.toLowerCase().split(' ');
  const first = firstName[0];
  const last = lastName ?? '';
  const svg = await fetch(
    `https://avatar-omega.vercel.app/${first}${last}.svg?text=${first.toUpperCase()}${
      last.toUpperCase()[0] ?? ''
    }`,
  ).then((res) => res.text());

  // 📣 Shout out to https://avatar.vercel.sh/
  return svg;
};

export const svgToImageURL = (svg?: string) => {
  if (!svg) return undefined;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};
