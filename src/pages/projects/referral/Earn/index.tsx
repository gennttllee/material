import useFetch from 'Hooks/useFetch';
import { displayError, displaySuccess, isReferralConverted } from 'Utils';
import { inviteReferralsEmail } from 'apis/referrals';
import Button from 'components/shared/Button';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import { IoLogoWhatsapp } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { ReactMultiEmail } from 'react-multi-email';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ReferralContext } from '../types';
import 'react-multi-email/dist/style.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton
} from 'react-share';
import useRole from 'Hooks/useRole';
import { useReferralDashboard } from 'Hooks/useReferrals';

const ReferralEarn = () => {
  const { user } = useRole();
  const [focused, setFocused] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const { dashboard } = useOutletContext<ReferralContext>();
  const { refetch } = useReferralDashboard();

  const { load, isLoading: isInvitesLoading } = useFetch({
    onSuccess: (response) => {
      setEmails([]);
      displaySuccess(response.message);
    }
  });

  if (!dashboard) return <></>;

  const data = useMemo(() => {
    let redeemed =
      dashboard?.withdrawalRequest?.reduce((sum, m) => {
        if (m.completedOn) {
          return sum + m.amount;
        } else {
          return sum;
        }
      }, 0) ?? 0;

    return [
      {
        percentage: '20%',
        label: 'Total Referrals',
        count: dashboard.referrals.length || 0
      },
      {
        percentage: '20%',
        label: 'Referrals converted',
        count: dashboard.referrals.filter((one) => isReferralConverted(one)).length || 0
      },
      {
        label: 'Cash earned',
        count: '$ ' + dashboard.amountEarned
      },
      {
        label: 'cash redeemed',
        count: '$ ' + redeemed
      }
    ];
  }, [dashboard]);

  const handleInvite = () => {
    if (!emails[0]) displayError('No emails we provided');
    load(inviteReferralsEmail(emails.map((email) => ({ email }))))
      .then((e) => {
        displaySuccess(`Invitation ${emails.length > 1 ? 'mails have' : 'mail has'} been sent`);
        refetch();
      })
      .catch((e) => {
        displayError('Something went wrong');
      });
  };
  const [height, setHeight] = useState(100);
  let ref = useRef<any>();
  useEffect(() => {
    setHeight(ref.current?.clientHeight || 100);
  });

  let navigate = useNavigate();

  return (
    <div className="w-full h-fit">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {React.Children.toArray(
          data.map(({ label, count }) => (
            <div className="p-5 rounded-md bg-white">
              <p className="font-Medium text-base text-black capitalize">{label}</p>
              <p className="font-Demibold text-3xl text-bash">{count}</p>
              {label === 'cash redeemed' && (
                <p
                  onClick={() => {
                    navigate('/projects/referrals/withdrawals');
                  }}
                  className="text-bblue hover:cursor-pointer hover:underline mt-2">
                  view more
                </p>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col    md:flex-row justify-between mt-5 gap-x-5">
        <div ref={ref} className="flex-[.6] ">
          <div className="p-6 bg-white flex-1 rounded-md">
            <p className="text-base font-Medium">Invite friend, business via link</p>
            <p className="text-xs text-bash font-Medium">
              Hi {user.firstName || user.name},<br /> Refer and earn big 💰. You&apos;ll get $300
              for every new customer you refer to us that starts a construction project on Bnkle.
            </p>
            <div className="bg-pbg p-4 rounded-md my-3">
              <p className="text-bash">Copy and share your link</p>
              <p>{dashboard.link}</p>
            </div>
            <div className={flexer}>
              <Button
                text="Copy link"
                onClick={() => {
                  window.navigator.clipboard.writeText(dashboard.link || '');
                  displaySuccess('Link copied successfully');
                }}
              />
              <div className="flex gap-4 items-center">
                <FacebookShareButton url={dashboard.link}>
                  <FaFacebookF className="text-bblue text-base" />
                </FacebookShareButton>
                <TwitterShareButton
                  url={dashboard.link}
                  title="Get projects done on time and on budget from anywhere"
                  hashtags={['bnkle', 'usebnkle']}>
                  <FaTwitter className="text-bblue text-base" />
                </TwitterShareButton>

                <LinkedinShareButton
                  url={dashboard.link}
                  title="Get projects done on time and on budget from anywhere"
                  htmlTitle={dashboard.link}>
                  <FaLinkedinIn className="text-bblue text-base" />
                </LinkedinShareButton>
                <WhatsappShareButton
                  url={dashboard.link}
                  title="Get projects done on time and on budget from anywhere"
                  separator={dashboard.referralCode}>
                  <IoLogoWhatsapp className="text-bblue text-base" />
                </WhatsappShareButton>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-md bg-white mt-5">
            <div className={flexer}>
              <p className="font-Medium text-black">Invite Friend, Business via Email</p>
              <button className={'font-Medium text-black' + hoverFade}>Preview email</button>
            </div>
            <ReactMultiEmail
              emails={emails}
              placeholder="Input your email"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={` ${focused ? 'border-bblue' : ''} !my-2 `}
              onChange={(_emails: string[]) => {
                setEmails(_emails);
              }}
              getLabel={(email, index, removeEmail) => {
                return (
                  <div data-tag key={index}>
                    <p data-tag-item className="font-Medium text-sm">
                      {email}
                    </p>
                    <span data-tag-handle onClick={() => removeEmail(index)}>
                      <AiOutlineClose className="text-xs text-black" />
                    </span>
                  </div>
                );
              }}
            />
            <p className="text-ashShade-2 text-sm">
              Press enter or type comma to invite multiple email address
            </p>
            <Button
              text="Invite"
              className="mt-2"
              onClick={handleInvite}
              isLoading={isInvitesLoading}
              type={emails[0] ? 'primary' : 'muted'}
            />
          </div>
        </div>
        <div style={{ height }} className=" flex-[.4]  overflow-y-auto">
          <div className="p-6 bg-white h-full overflow-y-scroll scrollbar-thin  rounded-md ">
            <div className="   ">
              <p className="font-semibold text-xl ">How it works</p>
              {React.Children.toArray(
                [
                  {
                    title: 'Get and Share your referral link',
                    content:
                      'Get your referral link and share with your friends through email or through social media.'
                  },
                  {
                    title: 'Track Your Referrals',
                    content:
                      'Track how your referrals are doing on your dashboard, including those that have converted.'
                  },
                  {
                    title: 'Earn $300 when your friends start a project on Bnkle',
                    content:
                      'As a thank you, when any of your friends start a project on Bnkle, you earn $300. The more friends who join and take action, the more you earn.'
                  },
                  {
                    title: 'Everyone Wins 🏆',
                    content:
                      'Every friend that you invite to build with Bnkle will get free switches and sockets with life time warranty.'
                  },
                  {
                    title: 'Redeem your earnings',
                    content: 'Redeem your earnings at anytime.'
                  },
                  {
                    title: 'Spread the love keep earning',
                    content:
                      "There's no limit to the number of friends you can refer or the rewards you can earn. Keep spreading the word, and keep enjoying the benefits of our Referral Program."
                  }
                ].map(({ title, content }, index) => (
                  <div className="flex gap-3 mt-3.5">
                    <div className={'w-8 h-8 bg-green-500 rounded-full' + centered}>
                      <p className="text-white text-base font-Medium">{index + 1}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="font-Demibold text-base">{title}</p>
                      <p className="text-sm">{content}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="flex items-end justify-end">
                {/* <button className={'text-borange text-base' + hoverFade}>Learn more</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
};

export default ReferralEarn;
