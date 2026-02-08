import { useState } from 'react';
import { Card, Button, Modal, Form, Input, Typography, Space, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '../lib/hooks/useRoles';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface RoleFormData {
  libelle: string;
  description: string;
}

interface Role {
  code: number;
  libelle: string;
  description?: string;
  date_creation: string;
  permissions?: any[];
}

export function RolesManagement() {
  const { data: roles, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue({
        libelle: role.libelle,
        description: role.description || '',
      });
    } else {
      setEditingRole(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleSubmit = async (values: RoleFormData) => {
    try {
      if (editingRole) {
        await updateRole.mutateAsync({
          id: editingRole.code,
          data: values,
        });
        message.success('Rôle modifié avec succès');
      } else {
        await createRole.mutateAsync(values);
        message.success('Rôle créé avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer le rôle "${role.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteRole.mutateAsync(role.code);
          message.success('Rôle supprimé avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer ce rôle');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text type="secondary">Chargement...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Gestion des rôles
          </Title>
          <Text type="secondary">Gérez les rôles et permissions du système</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouveau rôle
        </Button>
      </div>

      {/* Roles Grid */}
      <Row gutter={[16, 16]}>
        {roles?.map((role) => (
          <Col xs={24} sm={12} lg={8} key={role.code}>
            <Card
              hoverable
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenModal(role)}
                >
                  Modifier
                </Button>,
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(role)}
                >
                  Supprimer
                </Button>,
              ]}
            >
              <Card.Meta
                avatar={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#f0f5ff',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SafetyOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                  </div>
                }
                title={<Text strong>{role.libelle}</Text>}
                description={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {role.permissions?.length || 0} permissions
                  </Text>
                }
              />
              {role.description && (
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ marginTop: 16, marginBottom: 8 }}
                >
                  {role.description}
                </Paragraph>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                Créé le {new Date(role.date_creation).toLocaleDateString('fr-FR')}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {roles?.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Text type="secondary">Aucun rôle trouvé</Text>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingRole ? 'Modifier le rôle' : 'Nouveau rôle'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nom du rôle"
            name="libelle"
            rules={[{ required: true, message: 'Veuillez saisir le nom du rôle' }]}
          >
            <Input placeholder="PARISH_ADMIN" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Description du rôle..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createRole.isPending || updateRole.isPending}
              >
                {editingRole ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
