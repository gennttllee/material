import { FC } from 'react';

import { useAppSelector } from 'store/hooks';
import { CustomTable } from './components/CustomTable';
import { columns, dashboardData } from './constants';
import ProcurementTabs from '../layout/ProcurementTabs';
import { TbAccessible } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { BsFunnel } from 'react-icons/bs';

export const DashboardPage: FC = () => {
  const { loading } = useAppSelector((m) => m.dashboard);

  return (
    <div>
      <ProcurementTabs
        buttons={
          <>
            <div className="relative flex gap-2 pb-2">
              <Button
                className="border-ashShade-2 border px-0 mx-0"
                text=""
                type="plain"
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<BsFunnel color="#9099A8" />}
              />
              <Button
                className="border-ashShade-2 border px-0 mx-0"
                text=""
                type="plain"
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<TbAccessible color="#9099A8" />}
              />
            </div>
          </>
        }
      />

      <p className="font-Medium text-2xl mb-7">Dashboard</p>
      <CustomTable data={dashboardData} loading={loading} columns={columns} />
    </div>
  );
};
