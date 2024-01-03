import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { fetchApi } from '~/lib/fetch-client';
import { randomAvatar } from '~/lib/randomAvatar';
import { useWoofinderStore } from '~/lib/store';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Layout } from '~/components/layout';

import logo from '/woofinder.png';

export function SignIn() {
  document.title = 'Woofinder';
  const setUser = useWoofinderStore((state) => state.setUser);
  const router = useRouter();

  const loginSchema = z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const res = await fetchApi.login(values);
    const avatar = await randomAvatar(values.name);

    if (res === 'OK') {
      const user = { ...values, avatar };
      setUser(user);
      router.update({ context: { user } });
      router.navigate({ to: '/search' });
    }
  }

  return (
    <Layout className="min-h-0">
      <div className="flex flex-col items-center justify-center space-y-6">
        <img src={logo} height={250} width={250} alt="woofinder logo" />
        <h1 className="text-5xl font-extrabold">Woofinder</h1>
        <p className="text-center text-muted-foreground">
          Bringing Joy Home, One Pawsome Match at a Time
        </p>
        <Card className="w-[350px] md:w-[500px]">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your name and email below to sign into your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Last" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Sign In with Email</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}
