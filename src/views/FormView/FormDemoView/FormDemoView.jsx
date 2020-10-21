import React, { Component } from 'react'
import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import { Select, Layout, Form, Input, Button, DatePicker } from 'antd'
import '@/style/view-style/formDemo.scss'

const { Option } = Select
const { RangePicker } = DatePicker

class FromView extends Component {
    state = {
        search: {
            materialType: '',
            shopName: '',
            beginTime: '',
            endTime: '',
            currentPage: 1,
            pageSize: 10
        }
    }
    handleSearch = e => {
        e.preventDefault()
        this.props.form.validateFields((err, fieldsValue) => {
            console.log(fieldsValue)
            const rangeValue = fieldsValue['searchDate']
            const rangeTime = {
                beginTime: rangeValue[0].format('YYYY-MM-DD'),
                endTime: rangeValue[1].format('YYYY-MM-DD'),
                shopName: fieldsValue.shopName,
                materialType: fieldsValue.materialType
            }
            this.setState({
                search: { ...this.state.search, ...rangeTime }
            })
        })
    }
    handlerReset = e => {
        let initState = {
            materialType: '',
            shopName: '',
            beginTime: '',
            endTime: '',
            currentPage: 1,
            pageSize: 10
        }
        this.setState({
            search: { ...initState }
        })
        this.props.form.resetFields()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Layout className='animated fadeIn'>
                <div>
                    <CustomBreadcrumb arr={['表单', 'DEME页面']} />
                </div>
                <div className='base-style'>
                    <Form layout='inline' onSubmit={this.handleSearch}>
                        <Form.Item className='form_item' label='店铺'>
                            {getFieldDecorator(`shopName`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入店铺名称!'
                                    }
                                ]
                            })(<Input style={{ width: 160 }} placeholder='请输入店铺名称' />)}
                        </Form.Item>
                        <Form.Item label='型号'>
                            {getFieldDecorator(`materialType`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入型号!'
                                    }
                                ]
                            })(<Input placeholder='请输入型号' />)}
                        </Form.Item>
                        <Form.Item label='时间'>
                            {getFieldDecorator('searchDate', {
                                rules: [
                                    {
                                        type: 'array',
                                        required: true,
                                        message: '请选择时间!'
                                    }
                                ]
                            })(<RangePicker placeholder={['开始时间', '结束时间']} format={'YYYY-MM-DD'} />)}
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType='submit' type='primary' icon='search'>
                                查询
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon='reload' onClick={this.handlerReset}>
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Layout>
        )
    }
}

const FormDemodataList = Form.create({ name: 'form_demo' })(FromView)

export default FormDemodataList
