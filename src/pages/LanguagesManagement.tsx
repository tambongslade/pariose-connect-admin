import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Typography,
  message,
  Tag,
  Checkbox,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
  MoreOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
  useLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  useSetDefaultLanguage,
  useActivateLanguage,
  useDeactivateLanguage,
} from '../lib/hooks/useLanguages';
import type { Language } from '../lib/api/languages';

const { Title, Text } = Typography;

export function LanguagesManagement() {
  const { data: languages, isLoading } = useLanguages();

  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();
  const setDefaultLanguage = useSetDefaultLanguage();
  const activateLanguage = useActivateLanguage();
  const deactivateLanguage = useDeactivateLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (language?: Language) => {
    if (language) {
      setEditingLanguage(language);
      form.setFieldsValue({
        code: language.code,
        name: language.name,
        is_default: language.is_default,
        is_active: language.is_active,
      });
    } else {
      setEditingLanguage(null);
      form.resetFields();
      form.setFieldsValue({
        is_active: true,
        is_default: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLanguage(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingLanguage) {
        await updateLanguage.mutateAsync({
          code: editingLanguage.code,
          data: {
            name: values.name,
            is_active: values.is_active,
          },
        });
        message.success('Langue modifiée avec succès');
      } else {
        await createLanguage.mutateAsync(values);
        message.success('Langue créée avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (language: Language) => {
    if (language.is_default) {
      message.error('Impossible de supprimer la langue par défaut');
      return;
    }

    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${language.name}" (${language.code}) ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteLanguage.mutateAsync(language.code);
          message.success('Langue supprimée avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cette langue');
        }
      },
    });
  };

  const handleSetDefault = async (language: Language) => {
    if (!language.is_active) {
      message.error('Impossible de définir une langue inactive comme langue par défaut');
      return;
    }

    try {
      await setDefaultLanguage.mutateAsync(language.code);
      message.success(`${language.name} est maintenant la langue par défaut`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleToggleActive = async (language: Language) => {
    if (language.is_default && language.is_active) {
      message.error('Impossible de désactiver la langue par défaut');
      return;
    }

    try {
      if (language.is_active) {
        await deactivateLanguage.mutateAsync(language.code);
        message.success(`${language.name} a été désactivée`);
      } else {
        await activateLanguage.mutateAsync(language.code);
        message.success(`${language.name} a été activée`);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const getActionMenuItems = (language: Language): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'edit',
        label: 'Modifier',
        icon: <EditOutlined />,
        onClick: () => handleOpenModal(language),
      },
    ];

    if (!language.is_default) {
      items.push({
        key: 'set-default',
        label: 'Définir par défaut',
        icon: <StarOutlined />,
        onClick: () => handleSetDefault(language),
        disabled: !language.is_active,
      });
    }

    items.push({
      key: 'toggle-active',
      label: language.is_active ? 'Désactiver' : 'Activer',
      icon: language.is_active ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
      onClick: () => handleToggleActive(language),
      disabled: language.is_default && language.is_active,
    });

    if (!language.is_default) {
      items.push({
        type: 'divider',
      });
      items.push({
        key: 'delete',
        label: 'Supprimer',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDelete(language),
      });
    }

    return items;
  };

  const columns: ColumnsType<Language> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <Tag color="blue" icon={<GlobalOutlined />}>
          {code.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Par défaut',
      dataIndex: 'is_default',
      key: 'is_default',
      align: 'center',
      render: (isDefault: boolean) =>
        isDefault ? (
          <Tag color="gold" icon={<StarOutlined />}>
            Par défaut
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Statut',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Active
          </Tag>
        ) : (
          <Tag color="default" icon={<CloseCircleOutlined />}>
            Inactive
          </Tag>
        ),
    },
    {
      title: 'Date de création',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Langues
          </Title>
          <Text type="secondary">
            Gérez les langues disponibles pour l'internationalisation de l'application
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouvelle langue
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={languages}
        rowKey="code"
        loading={isLoading}
        pagination={false}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingLanguage ? 'Modifier la langue' : 'Nouvelle langue'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Code ISO 639-1"
            name="code"
            rules={[
              { required: true, message: 'Veuillez entrer le code de la langue' },
              { min: 2, max: 5, message: 'Le code doit contenir entre 2 et 5 caractères' },
              { pattern: /^[a-z]{2}(-[A-Z]{2})?$/, message: 'Format invalide (ex: en, fr, pt-BR)' },
            ]}
            tooltip="Codes ISO 639-1 (2 lettres) ou codes étendus pour variantes régionales (ex: en-US, pt-BR)"
          >
            <Input
              placeholder="en, fr, es"
              disabled={!!editingLanguage}
              style={{ textTransform: 'lowercase' }}
            />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="name"
            rules={[{ required: true, message: 'Veuillez entrer le nom de la langue' }]}
            tooltip="Utilisez le nom natif de la langue (ex: Français, Español, Deutsch)"
          >
            <Input placeholder="Français" />
          </Form.Item>

          {!editingLanguage && (
            <Form.Item name="is_default" valuePropName="checked">
              <Checkbox>Définir comme langue par défaut</Checkbox>
            </Form.Item>
          )}

          <Form.Item name="is_active" valuePropName="checked">
            <Checkbox>Langue active</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createLanguage.isPending || updateLanguage.isPending}
              >
                {editingLanguage ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
