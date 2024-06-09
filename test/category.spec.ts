import { HttpStatus } from '@nestjs/common';
import { TestContext } from './test-context';
import { CategoryDto, CategoryFilterDto, CreateCategoryDto } from 'src/modules/category/dto';
import { Category } from 'src/modules/category/entities/category.entity';
import { plainToInstance } from 'class-transformer';
import { plainToInstanceConfig } from 'src/configs';

const ctx = new TestContext();

beforeAll(() => ctx.init());

afterAll(() => ctx.close());

beforeEach(async () => {
    await ctx.clearDatabase();
});

afterEach(async () => {
    await ctx.clearDatabase();
});

describe('API Category', () => {
    describe('[POST] /category', () => {
        const baseCategoryDto: CreateCategoryDto = {
            active: true,
            id: '1',
            slug: 'slug-1',
            name: 'name-1',
            description: 'description-1',
        };

        test('Base create', async () => {
            const { body } = await ctx.request
                .post(`/category`)
                .send(baseCategoryDto)
                .expect(HttpStatus.CREATED);

            expect(body).toMatchObject({
                active: true,
                createdDate: expect.any(String),
                description: 'description-1',
                id: '1',
                name: 'name-1',
                slug: 'slug-1',
            });
        })

        test('Unique id test', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);
            const { body } = await ctx.request
                .post(`/category`)
                .send({
                    ...baseCategoryDto,
                    slug: '2',
                })
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toMatchSnapshot();
        })

        test('Unique slug test', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);
            const { body } = await ctx.request
                .post(`/category`)
                .send({
                    ...baseCategoryDto,
                    id: '2',
                })
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toMatchSnapshot();
        })

        test('Id and slug unique test', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);
            const { body } = await ctx.request
                .post(`/category`)
                .send({
                    ...baseCategoryDto,
                })
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toMatchSnapshot();
        })

        test('Successfully create second record', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);
            const { body } = await ctx.request
                .post(`/category`)
                .send({
                    ...baseCategoryDto,
                    id: '2',
                    slug: 'slug-2',
                })
                .expect(HttpStatus.CREATED);

            expect(body).toMatchObject({
                active: true,
                createdDate: expect.any(String),
                description: 'description-1',
                id: '2',
                name: 'name-1',
                slug: 'slug-2',
            });
        })
    })

    describe('[PATCH] /category/{id}', () => {
        const baseCategoryId = '1';
        const baseCategoryDto: CreateCategoryDto = {
            active: true,
            id: baseCategoryId,
            slug: 'slug-1',
            name: 'name-1',
            description: 'description-1',
        };

        test('Update all fields', async () => {
            const newCategoryId = '2';
            const newCategory = {
                active: false,
                id: newCategoryId,
                slug: 'slug-2',
                name: 'name-2',
                description: 'description-2',
            };

            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);

            await ctx.request
                .patch(`/category/${baseCategoryId}`)
                .send(newCategory)
                .expect(HttpStatus.NO_CONTENT);

            const modelInDb =
                plainToInstance(
                    CategoryDto,
                    await model.findOne({
                        id: newCategoryId,
                    }),
                    plainToInstanceConfig,
                )


            expect(modelInDb).toMatchObject(newCategory);
        })

        test('Update one field', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);
            const { body } = await ctx.request
                .patch(`/category/${baseCategoryDto.id}`)
                .send({
                    ...baseCategoryDto,
                    slug: '2',
                })
                .expect(HttpStatus.NO_CONTENT);

            expect(body).toMatchSnapshot();
        })

        test('Not found', async () => {
            const { body } = await ctx.request
                .patch(`/category/${baseCategoryDto.id}`)
                .send({
                    ...baseCategoryDto,
                    slug: '2',
                })
                .expect(HttpStatus.NOT_FOUND);

            expect(body).toMatchSnapshot();
        })
    })

    describe('[DELETE] /category/{id}', () => {
        const baseCategoryId = '1';
        const baseCategoryDto: CreateCategoryDto = {
            active: true,
            id: baseCategoryId,
            slug: 'slug-1',
            name: 'name-1',
            description: 'description-1',
        };

        test('Successfully delete', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);

            await ctx.request
                .delete(`/category/${baseCategoryId}`)
                .expect(HttpStatus.NO_CONTENT);

            const modelInDb = await model.findOne({
                id: baseCategoryDto.id,
            });

            expect(modelInDb).toBeNull();
        })

        test('Not found', async () => {
            const { body } = await ctx.request
                .delete(`/category/${baseCategoryId}`)
                .expect(HttpStatus.NOT_FOUND);

            expect(body).toMatchSnapshot();
        })
    })

    describe('[GET] /category/{idOrSlug}', () => {
        const baseCategoryId = '1';
        const baseCategoryDto: CreateCategoryDto = {
            active: true,
            id: baseCategoryId,
            slug: 'slug-1',
            name: 'name-1',
            description: 'description-1',
        };

        test('Successfully findOne by id', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);

            const { body } = await ctx.request
                .get(`/category/${baseCategoryDto.id}`)
                .expect(HttpStatus.OK);

            expect(body).toMatchObject(baseCategoryDto);
        })

        test('Successfully findOne by slug', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);

            const { body } = await ctx.request
                .get(`/category/${baseCategoryDto.slug}`)
                .expect(HttpStatus.OK);

            expect(body).toMatchObject(baseCategoryDto);
        })

        test('Not found by id', async () => {
            const model = ctx.getModel(Category.name);

            await model.create(baseCategoryDto);

            const { body } = await ctx.request
                .get(`/category/3`)
                .expect(HttpStatus.NOT_FOUND);

            expect(body).toMatchSnapshot();
        })
    })

    describe('[GET] /category', () => {
        const baseCategoryDto = {
            active: true,
            id: '1',
            slug: 'slug-1',
            name: 'name-1',
            description: 'description-1',
            createdDate: "2024-06-09T08:22:27.091Z",
        };

        const secondBaseCategoryDto = {
            active: true,
            id: '2',
            slug: 'slug-2',
            name: 'name-2',
            description: 'description-2',
            createdDate: "2024-07-09T08:22:27.091Z",
        };

        const noActiveCategoryDto = {
            active: false,
            id: '3',
            slug: 'slug-3',
            name: 'name-3',
            description: 'description-3',
            createdDate: "2024-08-09T08:22:27.091Z",
        };

        test('without filters and database is empty', async () => {
            const { body } = await ctx.request
                .get(`/category`)
                .expect(HttpStatus.OK);

            expect(body).toStrictEqual([]);
        })

        test('without filters and database have three entity, sort desc', async () => {
            const model = ctx.getModel(Category.name);

            await model.create([
                baseCategoryDto,
                secondBaseCategoryDto,
                noActiveCategoryDto,
            ]);

            const { body } = await ctx.request
                .get(`/category`)
                .expect(HttpStatus.OK);

            // Вернется две т.к. pageSize=2
            expect(body).toEqual([
                noActiveCategoryDto,
                secondBaseCategoryDto,
            ]);
        })

        test('without filters and database have three entity, sort asc, pageSize=3', async () => {
            const model = ctx.getModel(Category.name);

            await Promise.all([
                model.create(baseCategoryDto),
                model.create(secondBaseCategoryDto),
                model.create(noActiveCategoryDto),
            ]);

            const { body }: { body: CategoryDto[] } = await ctx.request
                .get(`/category`)
                .query({ sort: 'createdDate', pageSize: 3 })
                .expect(HttpStatus.OK);

            expect(body).toEqual([
                baseCategoryDto,
                secondBaseCategoryDto,
                noActiveCategoryDto,
            ]);
        })

        test('name=Мёд', async () => {
            const model = ctx.getModel(Category.name);
            const medCategoryDto = {
                active: true,
                id: '5',
                slug: 'slug-5',
                name: 'Мёд',
                description: 'description-5',
                createdDate: "2024-11-09T08:22:27.091Z",
            };

            await Promise.all([
                model.create(baseCategoryDto),
                model.create(secondBaseCategoryDto),
                model.create(noActiveCategoryDto),
                model.create(medCategoryDto),
            ]);

            const { body }: { body: CategoryDto[] } = await ctx.request
                .get(`/category`)
                .query({ name: 'мед' } as CategoryFilterDto)
                .expect(HttpStatus.OK);

            expect(body).toEqual([
                medCategoryDto
            ]);
        })

        describe('active test', () => {
            test('active=true', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'slug-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ active: 'true', pageSize: 10 })
                    .expect(HttpStatus.OK);

                expect(body.length).toEqual([
                    baseCategoryDto,
                    secondBaseCategoryDto,
                    medCategoryDto,
                ].length);
            })

            test('active=1', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'slug-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ active: '1', pageSize: 10 })
                    .expect(HttpStatus.OK);

                expect(body.length).toBe([
                    baseCategoryDto,
                    secondBaseCategoryDto,
                    medCategoryDto,
                ].length);
            })

            test('active=0', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'slug-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ active: '0', pageSize: 10 })
                    .expect(HttpStatus.OK);

                expect(body.length).toEqual([
                    noActiveCategoryDto,
                ].length);
            })

            test('active=false', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'slug-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ active: 'false', pageSize: 10 })
                    .expect(HttpStatus.OK);

                expect(body.length).toEqual([
                    noActiveCategoryDto,
                ].length);
            })
        })

        describe('search', () => {
            test('search=description', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'custom-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ search: medCategoryDto.description, pageSize: 10 } as CategoryFilterDto)
                    .expect(HttpStatus.OK);

                expect(body[0].description).toEqual(medCategoryDto.description);
            })

            test('search=name', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'custom-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({ search: medCategoryDto.name, pageSize: 10 } as CategoryFilterDto)
                    .expect(HttpStatus.OK);

                expect(body[0].name).toEqual(medCategoryDto.name);
            })

            test('search=name and ignoring params', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'custom-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({
                        search: medCategoryDto.name,
                        name: baseCategoryDto.name,
                        description: baseCategoryDto.description,
                        pageSize: 10
                    } as CategoryFilterDto
                    )
                    .expect(HttpStatus.OK);

                expect(body[0].name).toEqual(medCategoryDto.name);
            })
        })


        describe('pagination', () => {
            test('pageSize=2', async () => {
                const model = ctx.getModel(Category.name);
                const medCategoryDto = {
                    active: true,
                    id: '5',
                    slug: 'custom-5',
                    name: 'Мёд',
                    description: 'description-5',
                    createdDate: "2024-11-09T08:22:27.091Z",
                };

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                    model.create(medCategoryDto),
                ]);

                const pageSize = 2;
                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({
                        pageSize,
                    } as CategoryFilterDto
                    )
                    .expect(HttpStatus.OK);

                expect(body.length).toBe(pageSize);
            })

            test('page=2, pageSize=2', async () => {
                const model = ctx.getModel(Category.name);

                await Promise.all([
                    model.create(baseCategoryDto),
                    model.create(secondBaseCategoryDto),
                    model.create(noActiveCategoryDto),
                ]);

                const pageSize = 2;
                const page = 2;
                const { body }: { body: CategoryDto[] } = await ctx.request
                    .get(`/category`)
                    .query({
                        pageSize,
                        page,
                    } as CategoryFilterDto
                    )
                    .expect(HttpStatus.OK);

                expect(body.length).toBe(1);
            })
        })

    })
});
