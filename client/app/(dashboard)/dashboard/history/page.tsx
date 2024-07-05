'use client';
import BreadCrumb from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import ViewFruitDialog from '@/components/view-fruit-dialog';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { findAllRipe } from '@/store/ripeSlice';
import { useEffect } from 'react';

const breadcrumbItems = [{ title: 'History', link: '/dashboard/history' }];
export default function page() {
  const dispatch = useAppDispatch();
  const selectFindAllRipe = useAppSelector((state) => state.ripe.findAllRipe);
  useEffect(() => {
    (() => dispatch(findAllRipe()))();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`History`} description="See all history" />
          <Button className="text-xs md:text-sm">
            <Camera className="mr-2 h-4 w-4" /> Validate Fruit
          </Button>
        </div>
        <Separator />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {selectFindAllRipe.status === 'ok' &&
                selectFindAllRipe.response.map((e) => (
                  <Dialog>
                    <ViewFruitDialog src={e.images} alt="sdf" ripePercentage={JSON.parse(e.response).ripeNess} recommendation={JSON.parse(e.response).recommendation} title={JSON.parse(e.response).name} />
                  </Dialog>
                ))}

              {/* <Dialog>
                <ViewFruitDialog src="https://images.everydayhealth.com/images/diet-nutrition/ordinary-fruits-with-amazing-health-benefits-05-1440x810.jpg" alt="123123" title="Strawberry" ripePercentage={40} />
              </Dialog>

              <Dialog>
                <ViewFruitDialog src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/2560px-Orange-Fruit-Pieces.jpg" alt="Photo by Drew Beamer" title="Orange" ripePercentage={60} />
              </Dialog>

              <Dialog>
                <ViewFruitDialog src="https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834" alt="Photo by Drew Beamer" title="Apple" ripePercentage={90} />
              </Dialog> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
