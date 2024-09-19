import { sendRequest } from '@/utils/api';
import { useHasMounted } from '@/utils/customHook';
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message, Modal, notification, Steps } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: Function;
  userEmail: string;
}

interface IValues {
  email?: string;
  code?: string;
  _id?: string;
}

const ModalReactive = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState('');
  const hasMounted = useHasMounted();

  if (!hasMounted) return <></>;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinishStep0 = async (values: IValues) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reactive`,
      method: 'POST',
      body: {
        email,
      },
    });

    if (res?.data) {
      setCurrent(1);
      setId(res.data._id);
    } else {
      notification.error({
        message: 'Send Active code ',
        description: res?.message,
      });
    }
  };
  const onFinishStep1 = async (values: IValues) => {
    const { _id, code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: 'POST',
      body: {
        _id,
        code,
      },
    });
    if (res?.data) {
      message.success('Kích hoạt tài khoản thành công');
      setCurrent(2);
    } else {
      notification.error({
        message: 'Verification failed',
        description: res?.message,
      });
    }
  };
  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        width={800}
        footer={null}
      >
        <br />
        <Steps
          current={current}
          items={[
            {
              title: 'Login',

              icon: current === 0 ? <LoadingOutlined /> : <UserOutlined />,
            },
            {
              title: 'Verification',

              icon: current === 1 ? <LoadingOutlined /> : <SolutionOutlined />,
            },
            {
              title: 'Done',

              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <p style={{ margin: '20px 0' }}>Tài khoản chưa được kích hoạt</p>
            <Form
              name="notActive"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="" name="email" initialValue={userEmail}>
                <Input disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Resend
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <p style={{ margin: '20px 0' }}>Nhập mã kích hoạt</p>
            <Form
              name="verifyEmail"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item label="Id" name="_id" initialValue={id} hidden>
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Please input your code!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <>
            <p style={{ margin: '20px 0' }}>
              Tài khoản đã được kích hoạt thành công
            </p>
            <Button onClick={() => setIsModalOpen(false)}>
              Chuyển đến đăng nhập
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
