import { FormEvent, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { useGetConstructionCompaniesListQuery, useGetConstructionProjectsListQuery, useGetConstructionRequestsQuery, useSubmitConstructionRequestMutation, useUpdateConstructionRequestMutation } from '../store/constructionApiSlice';
import { selectToBeEditedRequest, setConstructionRequestsList } from '../store/constructionSlice';
import LoadingSpinner from './LoadingSpinner';

type Props = {}

const CreateRequest = (props: Props) => {

    const [description, setDescription] = useState('')
    const [remarks, setRemarks] = useState('')
    const [projectID, setProjectID] = useState<number>(1)
    const [companyID, setCompanyID] = useState<number>(1)

    const {
        data: companiesList,
        isLoading: isCompaniesListLoading,
    } = useGetConstructionCompaniesListQuery(undefined)

    const {
        data: projectsList,
        isLoading: isProjectsListLoading,
    } = useGetConstructionProjectsListQuery(undefined)


    const closeModalRef = useRef<HTMLButtonElement>(null)

    let request = useSelector(selectToBeEditedRequest)
    const [submitConstructionRequest, { isLoading }] = useSubmitConstructionRequestMutation()

    const submitRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let requestBody = {
            description,
            remarks,
            projectID,
            companyID
        }

        try {

            let response = await submitConstructionRequest(requestBody).unwrap()

        } catch (error) {
            console.log(error)
            alert('The creation of request failed')
        } finally {
            closeModalRef?.current?.click()
            window.location.reload()
        }
    }

    if (isLoading || isCompaniesListLoading || isProjectsListLoading) {
        return (<LoadingSpinner display={true}></LoadingSpinner>)
    }

    return (
        <section className="card">
            <div className="card-header">
                <h6 className="card-title">Create New Request Form</h6>
            </div>
            <div className="card-body">
                <form onSubmit={e => submitRequest(e)}>
                    <div className='row'>
                        <div className="col mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                            rows={1}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control"
                            ></textarea>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col mb-4">
                            <label className="form-label">Remarks</label>
                            <textarea
                            rows={1}
                                required
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="form-control"
                            ></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-4">
                            <label className="form-label">Project</label>
                            <select onChange={e => setProjectID(+e.target.value)} defaultValue={projectID} className="form-select">
                                <option value=""></option>
                                {(projectsList as any[]).map((project) => (
                                    <option value={project.projectID} key={project.projectID}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col mb-4">
                            <label className="form-label">Company</label>
                            <select onChange={e => setCompanyID(+e.target.value)} defaultValue={companyID} className="form-select">
                                <option value=""></option>
                                {(companiesList as any[]).map((company) => (
                                    <option value={company.companyID} key={company.companyID}>{company.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="col">
                            <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type={'submit'} style={{ backgroundColor: '#3F3F3F' }} value="Save" className='btn btn-secondary' />
                        </div>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default CreateRequest