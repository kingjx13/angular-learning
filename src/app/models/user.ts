/**
 * User 模型 - 定义用户数据的结构
 *
 * 在Angular中，接口(Interface)用于定义数据的类型约束
 * 当从API获取数据时，TypeScript会根据这个接口来检查数据类型是否匹配
 */
export interface User {
  /** 用户唯一标识符 */
  id: number;
  /** 用户真实姓名 */
  name: string;
  /** 用户名（登录用） */
  username: string;
  /** 电子邮箱 */
  email: string;
  /** 用户地址信息（可选，因为API可能不总是返回完整数据） */
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  /** 电话号码（可选） */
  phone?: string;
  /** 个人网站（可选） */
  website?: string;
  /** 公司信息（可选） */
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
