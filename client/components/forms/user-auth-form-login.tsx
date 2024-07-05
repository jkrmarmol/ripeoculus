'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setLoginInputEmail, setLoginInputPassword, cleanUpLoginInput, authLogin } from '@/store/auth/authenticationSlice';
import { DialogHeader, DialogTitle, DialogTrigger, Dialog, DialogDescription, DialogContent } from '../ui/dialog';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectLoginInput = useAppSelector((state) => state.authentication.loginInput);
  const [modal, setModal] = useState({
    incorrectPassword: false,
    userNotFound: false
  });
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async () => {
    setLoading(true);
    const { payload } = await dispatch(authLogin(selectLoginInput));
    if (payload.message === 'Username & Password Incorrect') {
      setModal((prev) => ({ ...prev, incorrectPassword: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, incorrectPassword: false }));
      }, 3000);
    }

    if (payload.message === 'User Not Found') {
      setModal((prev) => ({ ...prev, userNotFound: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, userNotFound: false }));
      }, 3000);
    }

    if (payload.accessToken) {
      localStorage.setItem('token', payload.accessToken);
      router.push('/dashboard');
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(cleanUpLoginInput());
    return () => {
      dispatch(cleanUpLoginInput());
    };
  }, []);

  return (
    <>
      <Dialog
        open={modal.userNotFound}
        onOpenChange={() =>
          setModal((prev) => ({
            ...prev,
            userNotFound: false
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Not Found</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal.incorrectPassword}
        onOpenChange={() =>
          setModal((prev) => ({
            ...prev,
            incorrectPassword: false
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email & Password Incorrect</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    onChangeCapture={(e) => {
                      dispatch(setLoginInputEmail(e.currentTarget.value));
                    }}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    onChangeCapture={(e) => {
                      dispatch(setLoginInputPassword(e.currentTarget.value));
                    }}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto mt-12 w-full" onClick={onSubmit} type="button">
            Login
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton /> */}
    </>
  );
}
