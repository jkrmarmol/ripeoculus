'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setRegisterInputEmail, setRegisterInputPassword, cleanUpRegisterInput, authRegister } from '@/store/auth/authenticationSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const dispatch = useAppDispatch();
  const selectRegisterInput = useAppSelector((state) => state.authentication.registerInput);
  const [modal, setModal] = useState({
    successRegistration: false,
    userAlreadyExist: false
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
    const { payload } = await dispatch(authRegister(selectRegisterInput));
    if (payload.message === 'User Already Existing') {
      setModal((prev) => ({ ...prev, userAlreadyExist: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, userAlreadyExist: false }));
      }, 3000);
    }
    if (Object.keys(payload)[0] == 'id') {
      setModal((prev) => ({ ...prev, successRegistration: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, successRegistration: false }));
      }, 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(cleanUpRegisterInput());

    return () => {
      dispatch(cleanUpRegisterInput());
    };
  }, []);

  return (
    <>
      <Dialog
        open={modal.successRegistration}
        onOpenChange={() =>
          setModal((prev) => ({
            ...prev,
            successRegistration: false
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successfully</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal.userAlreadyExist}
        onOpenChange={() =>
          setModal((prev) => ({
            ...prev,
            userAlreadyExist: false
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Already Exist</DialogTitle>
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
                      dispatch(setRegisterInputEmail(e.currentTarget.value));
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
                      dispatch(setRegisterInputPassword(e.currentTarget.value));
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
            Create account
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
