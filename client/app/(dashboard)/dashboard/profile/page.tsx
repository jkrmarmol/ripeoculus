'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { findEmail, setChangePassCurrentPassword, setChangePassNewPassword, cleanUpChangePasswordInput, changePassword } from '@/store/profileSlice';
import { useEffect, useState } from 'react';

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
export default function page() {
  const dispatch = useAppDispatch();
  const selectFindEmail = useAppSelector((state) => state.profile.findEmail);
  const selectChangePasswordInput = useAppSelector((state) => state.profile.changePasswordInput);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    incorrectCurrentPassword: false,
    success: false
  });
  const onSubmit = async () => {
    setLoading(true);
    const { payload } = await dispatch(changePassword(selectChangePasswordInput));
    console.log(payload);
    if (payload.message === 'Incorrect Current Password') {
      setModal((prev) => ({ ...prev, incorrectCurrentPassword: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, incorrectCurrentPassword: false }));
      }, 3000);
    }
    if (Object.keys(payload)[0] === 'id') {
      setModal((prev) => ({ ...prev, success: true }));
      setTimeout(() => {
        setModal((prev) => ({ ...prev, success: false }));
      }, 3000);
    }
    setLoading(false);
  };
  useEffect(() => {
    (async () => await dispatch(findEmail()))();
  }, []);
  return (
    <ScrollArea className="h-full">
      <Dialog open={modal.incorrectCurrentPassword} onOpenChange={() => setModal((prev) => ({ ...prev, incorrectCurrentPassword: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incorrect Current Password</DialogTitle>
            <DialogDescription>Incorrect password. Please try again.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={modal.success} onOpenChange={() => setModal((prev) => ({ ...prev, success: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed</DialogTitle>
            <DialogDescription>Your password has been successfully changed</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <Heading title={'Profile'} description={'Manage your profile'} />
        </div>
        <Separator />
        <div>
          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Email</Label>
                    <Input id="email" placeholder="Your email" disabled defaultValue={selectFindEmail.response.email} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Please type your current password"
                      onChangeCapture={(e) => dispatch(setChangePassCurrentPassword(e.currentTarget.value))}
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Setup new password" onChangeCapture={(e) => dispatch(setChangePassNewPassword(e.currentTarget.value))} disabled={loading} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={onSubmit} disabled={loading}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-3">
            <CardHeader></CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Account Deletion</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this account?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex text-left">
                    <Button type="submit">Cancel</Button>
                    <Button type="submit" variant="destructive">
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
