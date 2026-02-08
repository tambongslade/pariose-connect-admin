import { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Tag, Avatar, Typography, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../lib/hooks/useUsers';
import { useRoles } from '../lib/hooks/useRoles';

const { Title, Text } = Typography;

interface UserFormData {
  username: string;
  password: string;
  noms: string;
  prenoms: string;
  contact_1: string;
  addresse: string;
  roles: number[];
}

interface User {
  code: number;
  username: string;
  noms?: string;
  prenoms?: string;
  contact_1?: string;
  addresse?: string;
  date_creation: string;
  roles?: Array<{ code: number; libelle: string }>;
}

export function UsersManagement() {
  const { data: users, isLoading } = useUsers();
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const filteredUsers = users?.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.noms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenoms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        username: user.username,
        noms: user.noms || '',
        prenoms: user.prenoms || '',
        contact_1: user.contact_1 || '',
        addresse: user.addresse || '',
        roles: user.roles?.map((role) => role.code) || [],
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      // Prepare the data with roleIds
      const userData = {
        username: values.username,
        password: values.password || undefined,
        noms: values.noms,
        prenoms: values.prenoms,
        contact_1: values.contact_1,
        addresse: values.addresse,
        roleIds: values.roles,
      };

      if (editingUser) {
        // Update existing user
        await updateUser.mutateAsync({
          id: editingUser.code,
          data: userData,
        });
        message.success('Utilisateur modifié avec succès');
      } else {
        // Create new user
        await createUser.mutateAsync(userData);
        message.success('Utilisateur créé avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Une erreur est survenue'
      );
    }
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteUser.mutateAsync(user.code);
          message.success('Utilisateur supprimé avec succès');
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Impossible de supprimer cet utilisateur'
          );
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Utilisateur',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <Space>
          <Avatar style={{ backgroundColor: '#6366f1' }} icon={<UserOutlined />} />
          <Text strong>{username}</Text>
        </Space>
      ),
    },
    {
      title: 'Nom complet',
      key: 'fullname',
      render: (_, record) => `${record.prenoms || ''} ${record.noms || ''}`.trim() || '-',
    },
    {
      title: 'Contact',
      dataIndex: 'contact_1',
      key: 'contact_1',
      render: (contact: string) => contact || '-',
    },
    {
      title: 'Rôles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: Array<{ code: number; libelle: string }>) => (
        <>
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <Tag color="blue" key={role.code}>
                {role.libelle}
              </Tag>
            ))
          ) : (
            <Text type="secondary">Aucun rôle</Text>
          )}
        </>
      ),
    },
    {
      title: 'Date création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Gestion des utilisateurs
          </Title>
          <Text type="secondary">Gérez les utilisateurs du système</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouvel utilisateur
        </Button>
      </div>

      {/* Search */}
      <Input
        size="large"
        placeholder="Rechercher par nom ou nom d'utilisateur..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: 500 }}
      />

      {/* Users Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="code"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} utilisateurs`,
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Nom d'utilisateur"
              name="username"
              rules={[{ required: true, message: "Veuillez saisir le nom d'utilisateur" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={editingUser ? 'Nouveau mot de passe' : 'Mot de passe'}
              name="password"
              rules={
                editingUser
                  ? []
                  : [{ required: true, message: 'Veuillez saisir le mot de passe' }]
              }
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label="Nom" name="noms">
              <Input />
            </Form.Item>

            <Form.Item label="Prénom" name="prenoms">
              <Input />
            </Form.Item>

            <Form.Item label="Contact" name="contact_1">
              <Input placeholder="+237..." />
            </Form.Item>

            <Form.Item label="Adresse" name="addresse">
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Rôles"
            name="roles"
            rules={[{ required: true, message: 'Veuillez sélectionner au moins un rôle' }]}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionner les rôles"
              options={roles?.map((role) => ({
                label: role.libelle,
                value: role.code,
              }))}
              loading={!roles}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createUser.isPending || updateUser.isPending}
              >
                {editingUser ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
